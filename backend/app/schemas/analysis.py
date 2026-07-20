"""Pydantic schemas for Analysis results."""
import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class AnalysisOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    resume_id: uuid.UUID
    overall_score: int
    ats_score: int
    job_match_score: int
    summary: Optional[str] = None
    extracted_skills: list[str] = []
    missing_skills: list[str] = []
    strengths: list[str] = []
    weaknesses: list[str] = []
    grammar_suggestions: list[str] = []
    keyword_suggestions: list[str] = []
    recommendations: list[str] = []
    section_scores: dict = {}
    created_at: datetime
