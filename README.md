# Hack2Hire - AI-Powered Mock Interview Platform 🚀

**Hack2Hire** is a cutting-edge mock interview platform designed to simulate real-world technical interviews. It uses an AI-driven engine to adapt question difficulty based on candidate performance, creating a realistic, high-pressure environment complete with time constraints and objective scoring.

## 🌟 Key Features

- **📄 Resume Analysis**: Upload your PDF/Text resume, and the system automatically extracts skills to tailor the interview.
- **🧠 Adaptive AI Interviewer**:
  - Questions start based on your resume and the Job Description (JD).
  - **Dynamic Difficulty**: Answer well? The Next question gets harder. Struggle? It eases up.
- **⏱️ Real-Time Pressure**: Visual countdown timers enforce time limits, simulating actual interview stress.
- **📊 Comprehensive Scoring**:
  - Receive a final **Readiness Score (0-100)**.
  - Detailed breakdown of **Clarity**, **Technical Accuracy**, and **Relevance**.
  - Actionable feedback for every question.
- **🎨 Modern UI**: Built with React, Tailwind CSS, and Framer Motion for a premium, glassmorphism-inspired aesthetic.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** (v4)
- **Framer Motion** (Animations)
- **Recharts** (Data Visualization)
- **Lucide React** (Icons)

### Backend
- **FastAPI** (Python)
- **PyPDF2** (Resume Parsing)
- **Pydantic** (Data Validation)

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)

### 1️⃣ Clone the Repository
```bash
git clone <repository-url>
cd Hack2Interveiw
```

### 2️⃣ Backend Setup
Navigate to the backend folder and install dependencies:
```bash
# Create a virtual environment (Optional but Recommended)
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt
```

Start the Backend Server:
```bash
uvicorn backend.main:app --reload
```
*The backend API will run at `http://localhost:8000`*

### 3️⃣ Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies:
```bash
cd frontend
npm install
```

Start the Frontend Application:
```bash
npm run dev
```
*The web app will open at `http://localhost:5173` (or similar)*

---

## 📖 Usage Guide

1.  **Landing Page**: Click **"Start Mock Interview"**.
2.  **Setup**:
    - Upload your **Resume** (PDF or Text).
    - Paste a **Job Description** (or use the default one).
    - Click **"Start Interview Simulation"**.
3.  **Interview Room**:
    - The AI will present a question.
    - Type your answer in the text box.
    - Click **Submit** before the timer runs out!
    - *Note: If the timer hits zero, your answer is auto-submitted.*
4.  **Results**:
    - View your final score and readiness assessment.
    - Review individual feedback for each question.

---

## 📂 Project Structure

```
Hack2Interveiw/
├── backend/
│   ├── main.py              # API Entry Point & CORS Setup
│   ├── models.py            # Pydantic Data Models
│   ├── requirements.txt     # Python Dependencies
│   ├── routers/
│   │   └── interview.py     # API Endpoints (Session, Questions, Scoring)
│   └── services/
│       ├── ai_engine.py     # Mock AI Logic (Scoring & Adaptation)
│       └── resume_parser.py # Resume Text Extraction
├── frontend/
│   ├── src/
│   │   ├── pages/           # Landing, Setup, Interview, Results
│   │   ├── services/        # API Integration (Axios)
│   │   ├── App.jsx          # Main Router
│   │   └── index.css        # Tailwind Global Styles & Theme
│   ├── package.json         # Frontend Dependencies
│   ├── postcss.config.js    # Tailwind PostCSS Config
│   └── vite.config.js       # Vite Configuration
└── README.md                # Project Documentation
```

## ⚠️ Notes for Hackathon Judges
- **AI Logic**: The current iteration uses a **heuristic-based mock AI** for stability and speed during demos (no API keys required). It deterministically scores based on answer length and keywords to demonstrate the *adaptive architecture* without incurring LLM costs.
- **Persistence**: Sessions are stored in-memory on the backend. Restarting the backend server will clear active sessions.

---


