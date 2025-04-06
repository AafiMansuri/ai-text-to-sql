from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.db.main import init_db
from src.api.endpoints.user import router as user_router
from src.api.endpoints.chat import router as chat_router


@asynccontextmanager
async def life_span(app:FastAPI):
    print(f"Server is starting....")
    await init_db()
    yield
    
    print(f"Server has been stopped")

version="v1"
app = FastAPI(
    title="AskDB",
    description="A REST API for AI-Driven Text-to-SQL Application",
    version=version,
    lifespan=life_span
)

NGROK_URL = "https://your-ngrok-id.ngrok-free.app"

app.add_middleware(
    CORSMiddleware,
    allow_origins=[NGROK_URL,"http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)


app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(chat_router, prefix="/chats", tags=["chats"])
@app.get("/")
def root():
    return {"message": "FastAPI server is running"}