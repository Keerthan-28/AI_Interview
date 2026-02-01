import io
from PyPDF2 import PdfReader
from typing import List
import re

def parse_resume_content(file_content: bytes, filename: str) -> dict:
    text = ""
    try:
        if filename.endswith('.pdf'):
            reader = PdfReader(io.BytesIO(file_content))
            for page in reader.pages:
                text += page.extract_text() + "\n"
        else:
            text = file_content.decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        text = ""

    # Basic Regex for skills (Mock logic for now, real implementation would use NLP)
    skills_db = ["Python", "Java", "React", "Node.js", "SQL", "FastAPI", "Docker", "AWS", "Machine Learning", "CSS", "HTML", "TypeScript", "JavaScript", "C++", "Go", "Rust", "Kubernetes", "Git"]
    found_skills = [skill for skill in skills_db if re.search(r'\b' + re.escape(skill) + r'\b', text, re.IGNORECASE)]
    
    return {
        "raw_text": text,
        "skills": list(set(found_skills)),
        "experience_years": 0.0 # Placeholder
    }
