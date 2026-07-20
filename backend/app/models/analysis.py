"""Analysis model — stores the AI-generated analysis results for a resume."""
import uuid
from datetime import datetime

from sqlalchemy import String, DateTime, ForeignKey, Integer, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("resumes.id"), nullable=False)

    overall_score: Mapped[int] = mapped_column(Integer, default=0)
    ats_score: Mapped[int] = mapped_column(Integer, default=0)
    job_match_score: Mapped[int] = mapped_column(Integer, default=0)

    summary: Mapped[str] = mapped_column(Text, nullable=True)
    extracted_skills: Mapped[list] = mapped_column(JSON, default=list)
    missing_skills: Mapped[list] = mapped_column(JSON, default=list)
    strengths: Mapped[list] = mapped_column(JSON, default=list)
    weaknesses: Mapped[list] = mapped_column(JSON, default=list)
    grammar_suggestions: Mapped[list] = mapped_column(JSON, default=list)
    keyword_suggestions: Mapped[list] = mapped_column(JSON, default=list)
    recommendations: Mapped[list] = mapped_column(JSON, default=list)
    section_scores: Mapped[dict] = mapped_column(JSON, default=dict)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    resume: Mapped["Resume"] = relationship(back_populates="analysis")
