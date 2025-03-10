from dotenv import load_dotenv
import os

load_dotenv()

DB_URL_USER = os.getenv("DB_URL_USER")
DB_URL_ADMIN = os.getenv("DB_URL_ADMIN")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL")
