"""Resume model — represents an uploaded resume file."""
import uuid
from datetime import datetime

from sqlalchemy import String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Resume(Base):
    __tablename__ = "resumes"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    raw_text: Mapped[str] = mapped_column(Text, nullable=True)
    target_job_title: Mapped[str] = mapped_column(String(255), nullable=True)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    owner: Mapped["User"] = relationship(back_populates="resumes")
    analysis: Mapped["Analysis"] = relationship(back_populates="resume", uselist=False, cascade="all, delete-orphan")
