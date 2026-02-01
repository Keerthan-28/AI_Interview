import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SetupPage from './pages/SetupPage'
import InterviewRoom from './pages/InterviewRoom'
import ResultsDashboard from './pages/ResultsDashboard'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/interview" element={<InterviewRoom />} />
          <Route path="/results" element={<ResultsDashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
