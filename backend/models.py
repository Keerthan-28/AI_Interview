from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class QuestionType(str, Enum):
    TECHNICAL = "technical"
    BEHAVIORAL = "behavioral"
    CONCEPTUAL = "conceptual"
    CODING = "coding"

class Difficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class Question(BaseModel):
    id: str
    text: str
    type: QuestionType
    difficulty: Difficulty
    topic: str
    expected_key_points: List[str] = []

class AnswerSubmission(BaseModel):
    session_id: str
    question_id: str
    answer_text: str
    time_taken_seconds: int

class Score(BaseModel):
    clarity: int
    technical_accuracy: int
    relevance: int
    overall: int
    feedback: str

class ResumeData(BaseModel):
    raw_text: str
    skills: List[str]
    experience_years: float = 0.0
    projects: List[str] = []

class SessionStartRequest(BaseModel):
    resume_text: str
    jd_text: str

class SessionState(BaseModel):
    session_id: str
    candidate_name: Optional[str] = "Candidate"
    resume_data: Optional[ResumeData] = None
    job_description: Optional[str] = None
    current_question_index: int = 0
    history: List[Dict[str, Any]] = [] # Stores {question, answer, score}
    is_active: bool = True
    start_time: datetime = Field(default_factory=datetime.now)
