"""Pydantic schemas for User."""
import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict


class UserBase(BaseModel):
    full_name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserOut(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    is_active: bool
    created_at: datetime
