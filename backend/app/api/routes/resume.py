"""Resume upload & analysis routes."""
import logging

from fastapi import APIRouter, Depends, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import io

from app.api.deps import get_current_user
from app.core.config import settings
from app.db.session import get_db
from app.models.resume import Resume
from app.models.analysis import Analysis
from app.models.user import User
from app.schemas.resume import ResumeOut, ResumeWithAnalysis
from app.services.pdf_parser import extract_text_from_pdf
from app.services.ai_analyzer import analyze_resume
from app.services.report_generator import generate_analysis_pdf
from app.utils.exceptions import ResumeParsingError, NotFoundError

router = APIRouter(prefix="/resumes", tags=["Resumes"])
logger = logging.getLogger("resume_analyzer.resume")


@router.post("/upload", response_model=ResumeWithAnalysis, status_code=201)
async def upload_resume(
    file: UploadFile = File(...),
    target_job_title: str | None = Form(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if file.content_type != "application/pdf":
        raise ResumeParsingError("Only PDF files are supported.")

    file_bytes = await file.read()
    size_mb = len(file_bytes) / (1024 * 1024)
    if size_mb > settings.MAX_UPLOAD_SIZE_MB:
        raise ResumeParsingError(f"File exceeds the {settings.MAX_UPLOAD_SIZE_MB}MB size limit.")

    text = extract_text_from_pdf(file_bytes)

    resume = Resume(
        owner_id=current_user.id,
        filename=file.filename,
        raw_text=text,
        target_job_title=target_job_title,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    result = analyze_resume(text, target_job_title)
    analysis = Analysis(resume_id=resume.id, **result)
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    logger.info("Analyzed resume %s for user %s (score=%s)", resume.filename, current_user.email, analysis.overall_score)

    resume.analysis = analysis
    return resume


@router.get("", response_model=list[ResumeWithAnalysis])
def list_resumes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (
        db.query(Resume)
        .filter(Resume.owner_id == current_user.id)
        .order_by(Resume.uploaded_at.desc())
        .all()
    )


@router.get("/{resume_id}", response_model=ResumeWithAnalysis)
def get_resume(resume_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id, Resume.owner_id == current_user.id)
        .first()
    )
    if not resume:
        raise NotFoundError("Resume not found.")
    return resume


@router.delete("/{resume_id}", status_code=204)
def delete_resume(resume_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id, Resume.owner_id == current_user.id)
        .first()
    )
    if not resume:
        raise NotFoundError("Resume not found.")
    db.delete(resume)
    db.commit()
    return None


@router.get("/{resume_id}/report")
def download_report(resume_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id, Resume.owner_id == current_user.id)
        .first()
    )
    if not resume or not resume.analysis:
        raise NotFoundError("Resume or analysis not found.")

    analysis_dict = {
        "overall_score": resume.analysis.overall_score,
        "ats_score": resume.analysis.ats_score,
        "job_match_score": resume.analysis.job_match_score,
        "summary": resume.analysis.summary,
        "extracted_skills": resume.analysis.extracted_skills,
        "missing_skills": resume.analysis.missing_skills,
        "strengths": resume.analysis.strengths,
        "weaknesses": resume.analysis.weaknesses,
        "grammar_suggestions": resume.analysis.grammar_suggestions,
        "keyword_suggestions": resume.analysis.keyword_suggestions,
        "recommendations": resume.analysis.recommendations,
    }
    pdf_bytes = generate_analysis_pdf(resume.filename, resume.target_job_title, analysis_dict)

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="analysis-{resume.filename}.pdf"'},
    )
