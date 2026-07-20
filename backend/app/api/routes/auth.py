"""Authentication routes: register, login, Google sign-in, current user."""
import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, Token, GoogleLoginRequest
from app.schemas.user import UserCreate, UserOut
from app.api.deps import get_current_user
from app.utils.exceptions import AuthenticationError, DuplicateUserError

router = APIRouter(prefix="/auth", tags=["Authentication"])
logger = logging.getLogger("resume_analyzer.auth")


@router.post("/register", response_model=Token, status_code=201)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise DuplicateUserError("An account with this email already exists.")

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    logger.info("New user registered: %s", user.email)
    token = create_access_token(subject=str(user.id))
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not user.hashed_password or not verify_password(payload.password, user.hashed_password):
        raise AuthenticationError("Incorrect email or password.")

    token = create_access_token(subject=str(user.id))
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.post("/google", response_model=Token)
def google_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    """
    Verifies a Google ID token and logs the user in, creating an account
    on first sign-in. Requires GOOGLE_CLIENT_ID to be configured.
    """
    from google.oauth2 import id_token as google_id_token
    from google.auth.transport import requests as google_requests
    from app.core.config import settings

    idinfo = google_id_token.verify_oauth2_token(
        payload.id_token, google_requests.Request(), settings.GOOGLE_CLIENT_ID
    )

    email = idinfo["email"]
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            full_name=idinfo.get("name", email.split("@")[0]),
            email=email,
            google_id=idinfo["sub"],
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token(subject=str(user.id))
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
