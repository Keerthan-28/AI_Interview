import axios from 'axios';

// Normalize URL: remove trailing slash, ensure it ends with /api
let rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
if (rawUrl.endsWith('/')) rawUrl = rawUrl.slice(0, -1);
if (!rawUrl.endsWith('/api')) rawUrl += '/api';
const API_URL = rawUrl;

export const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/upload-resume`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const startSession = async (resumeText, jdText) => {
    const response = await axios.post(`${API_URL}/start-session`, {
        resume_text: resumeText,
        jd_text: jdText
    });
    return response.data;
};

export const getNextQuestion = async (sessionId) => {
    // FastAPI default expects query param if it's a simple type
    const response = await axios.post(`${API_URL}/next-question?session_id=${sessionId}`);
    return response.data;
};

export const submitAnswer = async (sessionId, questionId, text, timeTaken) => {
    const response = await axios.post(`${API_URL}/submit-answer`, {
        session_id: sessionId,
        question_id: questionId,
        answer_text: text,
        time_taken_seconds: timeTaken
    });
    return response.data;
};

export const getResults = async (sessionId) => {
    const response = await axios.get(`${API_URL}/results/${sessionId}`);
    return response.data;
};
