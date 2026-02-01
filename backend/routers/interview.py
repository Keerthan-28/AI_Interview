from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.models import SessionState, ResumeData, SessionStartRequest, Question, AnswerSubmission, Score
from backend.services.resume_parser import parse_resume_content
from backend.services.ai_engine import ai_engine
import uuid
from typing import Dict

router = APIRouter()

# In-memory session store
SESSIONS: Dict[str, SessionState] = {}

@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf") and not file.filename.endswith(".txt"):
         raise HTTPException(status_code=400, detail="Invalid file format")
    
    content = await file.read()
    data = parse_resume_content(content, file.filename)
    # Return extracted data so frontend can show it and send it back in start-session
    return data

@router.post("/start-session")
def start_session(request: SessionStartRequest):
    session_id = str(uuid.uuid4())
    
    # Parse resume text to data object again if needed, or just use what client sent?
    # For now assume client sends text, we wrap it
    resume_data = ResumeData(raw_text=request.resume_text, skills=[]) # simplified
    
    # Generate extraction again or trust client? 
    # Let's re-parse simply or just trust
    # Ideally upload-resume returns ID, but stateless for now is fine
    
    session = SessionState(
        session_id=session_id,
        resume_data=resume_data,
        job_description=request.jd_text
    )
    SESSIONS[session_id] = session
    return {"session_id": session_id}

@router.post("/next-question")
def next_question(session_id: str):
    session = SESSIONS.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    # Generate question
    context = {
        "history": session.history,
        "resume": session.resume_data,
        "jd": session.job_description
    }
    
    question = ai_engine.generate_question(context)
    if not question:
        return {"message": "Interview Complete", "is_complete": True}
        
    return question

@router.post("/submit-answer")
def submit_answer(submission: AnswerSubmission):
    session = SESSIONS.get(submission.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    # Find question object from ID (hacky, ideally store current question in session)
    # We will search in question bank.
    question = next((q for q in ai_engine.question_bank if q.id == submission.question_id), None)
    if not question:
         # Fallback if question not found (shouldn't happen)
         question = Question(id=submission.question_id, text="Unknown", type="technical", difficulty="easy", topic="Unknown")

    # Evaluate
    score = ai_engine.evaluate_answer(question, submission.answer_text)
    
    # Update Session
    session.history.append({
        "question": question.dict(),
        "answer": submission.answer_text,
        "score": score.dict(),
        "time_taken": submission.time_taken_seconds
    })
    
    return score

@router.get("/results/{session_id}")
def get_results(session_id: str):
    session = SESSIONS.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    # Calculate aggregation
    total_score = 0
    count = 0
    skills_feedback = {}
    
    for item in session.history:
        s = item['score']['overall']
        total_score += s
        count += 1
        
    final_score = int(total_score / count) if count > 0 else 0
    
    readiness = "Needs Improvement"
    if final_score > 80:
        readiness = "Strong Fit"
    elif final_score > 60:
        readiness = "Moderate Fit"
        
    return {
        "final_score": final_score,
        "readiness": readiness,
        "history": session.history,
        "total_questions": count
    }
