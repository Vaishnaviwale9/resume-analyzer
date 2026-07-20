"""
Database engine and session management.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.core.config import settings

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True, future=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)


def get_db() -> Session:
    """FastAPI dependency that yields a DB session and guarantees it's closed."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
