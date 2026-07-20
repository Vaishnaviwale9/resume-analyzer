"""Standalone analysis lookup + dashboard aggregate stats routes."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.resume import Resume
from app.models.user import User

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
def dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resumes = (
        db.query(Resume)
        .filter(Resume.owner_id == current_user.id)
        .all()
    )
    analyzed = [r for r in resumes if r.analysis]

    if not analyzed:
        return {
            "total_resumes": len(resumes),
            "average_score": 0,
            "average_ats_score": 0,
            "best_score": 0,
            "skill_frequency": {},
        }

    avg_score = round(sum(r.analysis.overall_score for r in analyzed) / len(analyzed))
    avg_ats = round(sum(r.analysis.ats_score for r in analyzed) / len(analyzed))
    best_score = max(r.analysis.overall_score for r in analyzed)

    skill_freq: dict[str, int] = {}
    for r in analyzed:
        for skill in r.analysis.extracted_skills:
            skill_freq[skill] = skill_freq.get(skill, 0) + 1

    return {
        "total_resumes": len(resumes),
        "average_score": avg_score,
        "average_ats_score": avg_ats,
        "best_score": best_score,
        "skill_frequency": dict(sorted(skill_freq.items(), key=lambda x: -x[1])[:10]),
    }
