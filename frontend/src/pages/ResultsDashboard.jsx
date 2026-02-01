import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getResults } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { CheckCircle, AlertTriangle, XCircle, Home, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const ResultsDashboard = () => {
    const navigate = useNavigate();
    const sessionId = localStorage.getItem('sessionId');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!sessionId) {
            navigate('/');
            return;
        }
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const data = await getResults(sessionId);
            setResults(data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-primary font-bold text-xl">Generating Comprehensive Report...</div>;
    if (!results) return <div className="min-h-screen flex items-center justify-center">No Results Found</div>;

    const scoreColor = results.final_score > 75 ? '#10b981' : results.final_score > 50 ? '#f59e0b' : '#ef4444';

    const pieData = [
        { name: 'Score', value: results.final_score },
        { name: 'Gap', value: 100 - results.final_score }
    ];

    return (
        <div className="min-h-screen bg-slate-900 p-6">
            <header className="max-w-7xl mx-auto mb-10 flex justify-between items-center">
                <h1 className="text-3xl font-bold">Interview Performance Report</h1>
                <button onClick={() => navigate('/')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center">
                    <Home className="w-4 h-4 mr-2" /> Back to Home
                </button>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Score Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 flex flex-col items-center justify-center col-span-1"
                >
                    <h2 className="text-xl font-semibold text-slate-400 mb-4">Final Readiness Score</h2>
                    <div className="relative w-64 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    <Cell key="score" fill={scoreColor} />
                                    <Cell key="gap" fill="#334155" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-6xl font-bold" style={{ color: scoreColor }}>{results.final_score}</span>
                            <span className="text-sm text-slate-400">/ 100</span>
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <span className={`inline-block px-4 py-2 rounded-full text-lg font-bold bg-opacity-20`} style={{ backgroundColor: `${scoreColor}20`, color: scoreColor }}>
                            {results.readiness}
                        </span>
                    </div>
                </motion.div>

                {/* Analysis */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-8 col-span-1 lg:col-span-2"
                >
                    <h2 className="text-xl font-semibold mb-6 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-primary" /> Performance Summary
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                            <span className="block text-slate-400 text-sm mb-1">Total Questions</span>
                            <span className="text-2xl font-bold">{results.total_questions}</span>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                            <span className="block text-slate-400 text-sm mb-1">Avg. Time / Q</span>
                            <span className="text-2xl font-bold">45s</span> {/* Mock data */}
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                            <span className="block text-slate-400 text-sm mb-1">Completion Rate</span>
                            <span className="text-2xl font-bold">100%</span>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-4">Question Breakdown</h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {results.history.map((item, idx) => (
                            <div key={idx} className="bg-slate-800/30 p-4 rounded-lg border border-slate-700 hover:border-slate-500 transition">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-semibold text-sm bg-slate-700 px-2 py-1 rounded text-slate-300">Q{idx + 1}</span>
                                    <span className={`text-sm font-bold ${item.score.overall > 70 ? 'text-green-400' : 'text-yellow-400'}`}>
                                        Score: {item.score.overall}
                                    </span>
                                </div>
                                <p className="text-slate-300 mb-2 font-medium">{item.question.text}</p>
                                <div className="text-sm text-slate-400 bg-slate-900/50 p-3 rounded">
                                    <span className="text-slate-500 block text-xs uppercase mb-1">Feedback</span>
                                    {item.score.feedback}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    );
};
export default ResultsDashboard;
