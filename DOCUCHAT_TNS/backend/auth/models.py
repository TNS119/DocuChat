from pydantic import BaseModel, Field


class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=30)
    password: str = Field(min_length=6)


class LoginRequest(BaseModel):
    # BUG 4 FIX: Added validation — blocks empty/blank credentials before they hit the DB
    username: str = Field(min_length=1, max_length=30)
    password: str = Field(min_length=1)