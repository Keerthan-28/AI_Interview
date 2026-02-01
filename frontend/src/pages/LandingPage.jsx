import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Code, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10"
            >
                <div className="flex items-center justify-center mb-6">
                    <Brain className="w-16 h-16 text-primary mr-2" />
                    <h1 className="text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">
                        Hack2Hire
                    </h1>
                </div>
                <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                    The <span className="text-secondary font-semibold">AI-Powered</span> Mock Interview Platform that feels real.
                    Master your technical interviews with <span className="text-primary font-semibold">adaptive pressure</span>, real-time feedback, and objective scoring.
                </p>
                <Link to="/setup" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-indigo-600 hover:from-indigo-500 hover:to-primary text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-primary/50 transform hover:scale-105 active:scale-95">
                    Start Mock Interview <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-6xl w-full px-4">
                <motion.div
                    whileHover={{ y: -5 }}
                    className="glass-card p-8 text-left border-l-4 border-l-secondary"
                >
                    <Cpu className="w-12 h-12 text-secondary mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Adaptive AI</h3>
                    <p className="text-slate-400">Questions that adapt to your skill level in real-time based on your responses.</p>
                </motion.div>
                <motion.div
                    whileHover={{ y: -5 }}
                    className="glass-card p-8 text-left border-l-4 border-l-cyan-400"
                >
                    <Code className="w-12 h-12 text-cyan-400 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Real Scenarios</h3>
                    <p className="text-slate-400">Solve actual coding problems, architectural design, and behavioral challenges.</p>
                </motion.div>
                <motion.div
                    whileHover={{ y: -5 }}
                    className="glass-card p-8 text-left border-l-4 border-l-emerald-400"
                >
                    <Brain className="w-12 h-12 text-emerald-400 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Detailed Scoring</h3>
                    <p className="text-slate-400">Get a comprehensive breakdown of your strengths, weaknesses, and hiring readiness.</p>
                </motion.div>
            </div>
        </div>
    );
};

export default LandingPage;
