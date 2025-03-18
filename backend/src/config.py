from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    NEON_DB_URL : str
    DB_URL_USER : str
    DB_URL_ADMIN : str
    OLLAMA_MODEL : str
    CLERK_SECRET_KEY : str
    CLERK_API_URL : str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

Config = Settings()