"""User profile routes."""
from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.user import UserOut

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/profile", response_model=UserOut)
def profile(current_user: User = Depends(get_current_user)):
    return current_user
