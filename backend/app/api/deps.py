"""Shared FastAPI dependencies: DB session + current authenticated user."""
from fastapi import Depends, Header
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.user import User
from app.utils.exceptions import AuthenticationError


def get_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> User:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise AuthenticationError("Missing or invalid Authorization header.")

    token = authorization.split(" ", 1)[1]
    user_id = decode_access_token(token)
    if not user_id:
        raise AuthenticationError("Invalid or expired token.")

    user = db.get(User, user_id)
    if not user or not user.is_active:
        raise AuthenticationError("User not found or inactive.")
    return user
