"""
Application configuration.

Loads settings from environment variables / .env file using pydantic-settings.
Centralizing config here means the rest of the app never touches os.environ
directly, which keeps configuration testable and predictable.
"""
from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # --- App ---
    APP_NAME: str = "AI Resume Analyzer"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # --- Security ---
    SECRET_KEY: str = "insecure-dev-secret-change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # --- Database ---
    DATABASE_URL: str = "postgresql://resume_user:resume_pass@db:5432/resume_analyzer"

    # --- CORS ---
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    # --- Google OAuth ---
    GOOGLE_CLIENT_ID: str = ""

    # --- Optional external AI provider ---
    OPENAI_API_KEY: str = ""

    # --- Uploads ---
    MAX_UPLOAD_SIZE_MB: int = 10
    UPLOAD_DIR: str = "uploads"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance so we don't re-parse env vars on every call."""
    return Settings()


settings = get_settings()
