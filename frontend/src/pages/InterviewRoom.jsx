import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNextQuestion, submitAnswer } from '../services/api';
import { Clock, Send, Mic, AlertCircle, Brain, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InterviewRoom = () => {
    const navigate = useNavigate();
    const sessionId = localStorage.getItem('sessionId');

    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(120);
    const [totalTime, setTotalTime] = useState(120);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!sessionId) {
            navigate('/');
            return;
        }
        fetchQuestion();
        return () => clearInterval(timerRef.current);
    }, []);

    const fetchQuestion = async () => {
        setLoading(true);
        try {
            const data = await getNextQuestion(sessionId);
            if (data.is_complete || data.message === "Interview Complete") {
                navigate('/results');
                return;
            }
            setQuestion(data);
            setAnswer('');

            // Set time based on difficulty (Mock logic)
            const time = data.difficulty === 'hard' ? 180 : (data.difficulty === 'medium' ? 120 : 90);
            setTotalTime(time);
            setTimeLeft(time);

            startTimer();
        } catch (error) {
            console.error("Error fetching question:", error);
            if (error.response && error.response.status === 404) {
                alert("Session expired. Redirecting to home.");
                navigate('/');
            } else {
                alert("Error fetching question. Please try again.");
            }
        }
        setLoading(false);
    };

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleSubmit(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSubmit = async (autoSubmit = false) => {
        if (isSubmitting) return;
        if (!question) return;

        setIsSubmitting(true);
        clearInterval(timerRef.current);

        try {
            const timeTaken = totalTime - timeLeft;
            await submitAnswer(sessionId, question.id, autoSubmit ? "Time Expired" : answer, timeTaken);
            await fetchQuestion();
        } catch (error) {
            console.error(error);
            if (error.response) {
                if (error.response.status === 404) {
                    alert("Session expired or invalid. Please start a new interview.");
                    navigate('/');
                } else {
                    alert(`Failed to submit answer. Server responded with: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
                }
            } else if (error.request) {
                alert("Network error: No response received from server. Check if backend is running.");
            } else {
                alert(`Error: ${error.message}`);
            }
        }
        setIsSubmitting(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Calculate progress for timer ring
    const progress = ((totalTime - timeLeft) / totalTime) * 100;

    return (
        <div className="min-h-screen bg-slate-900 p-6 flex flex-col">
            <header className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <Brain className="w-8 h-8 text-primary mr-2" />
                    <span className="text-xl font-bold">AI Interviewer</span>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="glass-card px-4 py-2 flex items-center text-red-400">
                        <div className="relative w-8 h-8 mr-2 flex items-center justify-center">
                            {/* Timer Ring */}
                            <svg className="absolute w-full h-full transform -rotate-90">
                                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="transparent" className="opacity-20" />
                                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="transparent"
                                    strokeDasharray={88}
                                    strokeDashoffset={88 - (88 * (timeLeft / totalTime))}
                                    className="text-red-500 transition-all duration-1000"
                                />
                            </svg>
                            <span className="text-xs font-bold text-white relative z-10">{timeLeft}</span>
                        </div>
                        <span className="font-mono">{formatTime(timeLeft)}</span>
                    </div>
                    <button onClick={() => navigate('/results')} className="text-slate-400 hover:text-white px-3 py-1 text-sm bg-white/5 rounded">End Interview</button>
                </div>
            </header>

            <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto w-full">
                {/* AI / Question Panel */}
                <div className="glass-card p-8 flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950/30">
                    {loading ? (
                        <div className="flex flex-col items-center animate-pulse">
                            <div className="w-20 h-20 bg-slate-700 rounded-full mb-4"></div>
                            <div className="h-4 bg-slate-700 w-3/4 rounded mb-2"></div>
                            <div className="h-4 bg-slate-700 w-1/2 rounded"></div>
                        </div>
                    ) : (
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={question?.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="z-10"
                            >
                                <div className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold mb-4 uppercase tracking-wide">
                                    {question?.difficulty} • {question?.type}
                                </div>
                                <h2 className="text-3xl font-bold leading-tight mb-6">{question?.text}</h2>
                                <p className="text-slate-400 text-lg italic">
                                    "Please take your time to read the question and provide a comprehensive answer."
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    )}

                    {/* Decorative background pulse */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                </div>

                {/* User Input Panel */}
                <div className="glass-card p-8 flex flex-col bg-slate-800/50">
                    <label className="text-sm font-semibold text-slate-400 mb-2 flex justify-between">
                        <span>Your Answer</span>
                        <span className="flex items-center"><Mic className="w-4 h-4 mr-1 text-slate-500" /> Voice Input (Coming Soon)</span>
                    </label>
                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-6 text-lg focus:ring-2 focus:ring-primary outline-none resize-none font-sans leading-relaxed"
                        placeholder="Type your answer here..."
                        disabled={loading || isSubmitting}
                    />
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => handleSubmit(false)}
                            disabled={!answer.trim() || loading || isSubmitting}
                            className="px-8 py-3 bg-primary hover:bg-indigo-600 disabled:opacity-50 text-white rounded-lg font-bold flex items-center transition shadow-lg transform active:scale-95"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Answer'} <Send className="ml-2 w-4 h-4" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default InterviewRoom;
