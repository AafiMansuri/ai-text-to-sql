from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.user import router as user_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)


app.include_router(user_router, prefix="/users", tags=["users"])

@app.get("/")
def root():
    return {"message": "FastAPI server is running"}
