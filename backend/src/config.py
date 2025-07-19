from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    MAIN_DATABASE_URL : str
    CLERK_SECRET_KEY : str
    CLERK_API_URL : str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

Config = Settings()