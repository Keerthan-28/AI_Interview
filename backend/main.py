from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import interview

app = FastAPI(title="Hack2Hire API")

import os

origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174")
origins = origins_env.split(",")

app.add_middleware(
    CORSMiddleware,
    # CORS Regex: Matches localhost (any port) AND any https Vercel/Render URL
    allow_origin_regex="http://localhost:\d+|http://127\.0\.0\.1:\d+|https://.*\.vercel\.app|https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interview.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Hack2Hire API is running"}
