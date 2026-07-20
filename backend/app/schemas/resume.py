"""Pydantic schemas for Resume."""
import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.schemas.analysis import AnalysisOut


class ResumeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    filename: str
    target_job_title: Optional[str] = None
    uploaded_at: datetime


class ResumeWithAnalysis(ResumeOut):
    analysis: Optional[AnalysisOut] = None
