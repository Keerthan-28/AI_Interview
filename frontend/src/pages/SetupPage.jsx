import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { uploadResume, startSession } from '../services/api';

const SetupPage = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [resumeText, setResumeText] = useState('');
    const [jdText, setJdText] = useState(`We are looking for a Full Stack Developer with experience in React, Node.js, and Cloud technologies.
  
Responsibilities:
- Build scalable web applications.
- Design RESTful APIs.
- Collaborative with cross-functional teams.`);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Resume, 2: JD & Review

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setLoading(true);
            try {
                const data = await uploadResume(selectedFile);
                setResumeText(data.raw_text);
                setFile(selectedFile);
                setStep(2);
            } catch (error) {
                console.error(error);
                if (error.response) {
                    alert(`Upload failed: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
                } else if (error.message) {
                    alert(`Upload failed: ${error.message} (Often due to CORS or wrong API URL)`);
                } else {
                    alert("Failed to upload resume");
                }
            }
            setLoading(false);
        }
    };

    const handleStartInterview = async () => {
        setLoading(true);
        try {
            const data = await startSession(resumeText, jdText);
            localStorage.setItem('sessionId', data.session_id);
            navigate('/interview');
        } catch (error) {
            console.error(error);
            alert("Failed to start session");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-4xl">
                <h1 className="text-4xl font-bold mb-2 text-center">Interview Setup</h1>
                <p className="text-slate-400 text-center mb-10">Let's personalize your interview experience.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Resume Section */}
                    <div className={`glass-card p-8 transition-all ${step === 1 ? 'ring-2 ring-primary' : ''}`}>
                        <div className="flex items-center mb-6">
                            <FileText className="text-secondary w-8 h-8 mr-3" />
                            <h2 className="text-2xl font-bold">1. Upload Resume</h2>
                        </div>

                        {file ? (
                            <div className="bg-green-500/10 border border-green-500/50 p-4 rounded-lg flex items-center justify-between">
                                <span className="truncate max-w-[200px]">{file.name}</span>
                                <span className="text-green-400 font-bold text-sm">Uploaded</span>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-slate-600 rounded-lg p-10 flex flex-col items-center justify-center hover:border-primary transition cursor-pointer relative">
                                <input type="file" accept=".pdf,.txt" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                {loading ? <Loader2 className="w-10 h-10 text-primary animate-spin" /> : <Upload className="w-10 h-10 text-slate-400 mb-4" />}
                                <p className="text-slate-400">Drag & drop or Click to upload PDF</p>
                            </div>
                        )}

                        {resumeText && (
                            <div className="mt-4">
                                <h3 className="text-sm font-semibold text-slate-400 mb-2">Extracted Data Preview:</h3>
                                <div className="bg-slate-950 p-3 rounded text-xs text-slate-500 h-32 overflow-y-auto font-mono">
                                    {resumeText}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* JD Section */}
                    <div className={`glass-card p-8 transition-all ${step === 2 ? 'ring-2 ring-primary' : 'opacity-50 pointer-events-none'}`}>
                        <div className="flex items-center mb-6">
                            <FileText className="text-cyan-400 w-8 h-8 mr-3" />
                            <h2 className="text-2xl font-bold">2. Job Description</h2>
                        </div>

                        <textarea
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                            className="w-full h-64 bg-slate-950 border border-slate-700 rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                            placeholder="Paste the Job Description here..."
                        />
                    </div>
                </div>

                <div className="mt-12 flex justify-center">
                    <button
                        onClick={handleStartInterview}
                        disabled={step < 2 || loading}
                        className="px-10 py-4 bg-gradient-to-r from-primary to-indigo-600 rounded-full font-bold text-lg shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                        Start Interview Simulation <ArrowRight className="ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};
export default SetupPage;
