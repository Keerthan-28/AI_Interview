from backend.models import Question, QuestionType, Difficulty, Score
import random
import uuid

class MockAIEngine:
    def __init__(self):
        self.question_bank = [
            Question(id="1", text="Can you walk me through your experience with React and why you prefer it over other frameworks?", type=QuestionType.TECHNICAL, difficulty=Difficulty.EASY, topic="Frontend"),
            Question(id="2", text="Explain the difference between SQL and NoSQL databases. When would you choose one over the other?", type=QuestionType.TECHNICAL, difficulty=Difficulty.EASY, topic="Databases"),
            Question(id="3", text="Describe a time you faced a difficult technical challenge. How did you approach it?", type=QuestionType.BEHAVIORAL, difficulty=Difficulty.MEDIUM, topic="Experience"),
            Question(id="4", text="How does the Virtual DOM work in React, and how does it improve performance?", type=QuestionType.TECHNICAL, difficulty=Difficulty.MEDIUM, topic="Frontend"),
            Question(id="5", text="Design a scalable URL shortening service like Bit.ly. Discuss the database schema and caching strategy.", type=QuestionType.TECHNICAL, difficulty=Difficulty.HARD, topic="System Design"),
            Question(id="6", text="What are the key differences between a process and a thread?", type=QuestionType.TECHNICAL, difficulty=Difficulty.MEDIUM, topic="OS"),
            Question(id="7", text="Explain the concept of RESTful APIs. What are the constraints?", type=QuestionType.TECHNICAL, difficulty=Difficulty.EASY, topic="API"),
            Question(id="8", text="How would you handle a situation where a team member is not pulling their weight?", type=QuestionType.BEHAVIORAL, difficulty=Difficulty.MEDIUM, topic="Teamwork"),
        ]

    def generate_question(self, context: dict) -> Question:
        # Context contains history, resume, jd
        history_ids = [h['question'].get('id') for h in context.get('history', [])]
        available = [q for q in self.question_bank if q.id not in history_ids]
        
        if not available:
            return None
            
        # adaptive logic
        # if last answer was good, pick harder.
        last_item = context.get('history', [])[-1] if context.get('history') else None
        target_difficulty = Difficulty.EASY
        
        if last_item:
            last_score = last_item.get('score', {}).get('overall', 0)
            if last_score > 75:
                target_difficulty = Difficulty.HARD if random.random() > 0.5 else Difficulty.MEDIUM
            elif last_score > 50:
                target_difficulty = Difficulty.MEDIUM
            else:
                target_difficulty = Difficulty.EASY
                
        # Filter by difficulty if possible
        filtered = [q for q in available if q.difficulty == target_difficulty]
        if not filtered:
            filtered = available # Fallback
            
        return random.choice(filtered)

    def evaluate_answer(self, question: Question, answer: str) -> Score:
        # Mock evaluation logic
        # 1. Check length
        words = len(answer.split())
        
        clarity = min(100, int(words * 1.5))
        relevance = 85 # Assume relevant for mock
        technical = 70
        
        if words < 10:
            feedback = "Your answer was too short. Please elaborate more."
            clarity = 30
            technical = 30
            relevance = 50
        elif words > 30:
            feedback = "Good detailed response. You covered key aspects."
            technical = 85
            clarity = 90
        else:
            feedback = "Decent answer, but could be more specific."
            
        overall = int((clarity + technical + relevance) / 3)
        
        return Score(
            clarity=clarity,
            technical_accuracy=technical,
            relevance=relevance,
            overall=overall,
            feedback=feedback
        )

ai_engine = MockAIEngine()
