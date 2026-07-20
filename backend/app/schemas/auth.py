"""Pydantic schemas for authentication."""
from pydantic import BaseModel, EmailStr

from app.schemas.user import UserOut


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class GoogleLoginRequest(BaseModel):
    id_token: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
