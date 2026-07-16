import os
from fastapi import APIRouter

from auth.models import RegisterRequest
from auth.auth_service import register_user

from fastapi import Response, status
from auth.models import LoginRequest
from auth.auth_service import login_user

from fastapi import Depends
from auth.dependencies import get_current_user

from services.mongodb import get_user_sessions

from services.mongodb import get_session_history

from services.mongodb import delete_session

from services.vector_db_service import delete_vector_db

# BUG 1 FIX: Read environment mode from .env
# Set IS_PRODUCTION=true in your production .env file
# Leave it unset or false for local development
IS_PRODUCTION = os.getenv("IS_PRODUCTION", "false").lower() == "true"

# Cookie security settings differ between dev and prod:
# - Production (HTTPS, cross-origin): secure=True, samesite="None"
# - Development (HTTP, same-host):    secure=False, samesite="Lax"
COOKIE_SECURE = IS_PRODUCTION
COOKIE_SAMESITE = "None" if IS_PRODUCTION else "Lax"

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(user: RegisterRequest):
    return register_user(user)

# print("Auth router loaded")
# print(router.routes)



@router.post("/login")
def login(
    user: LoginRequest,
    response: Response
):

    result = login_user(user)

    if not result["success"]:

        response.status_code = status.HTTP_401_UNAUTHORIZED

        return result

    response.set_cookie(
        key="access_token",
        value=result["token"],
        httponly=True,
        secure=COOKIE_SECURE,      # BUG 1 FIX: True in prod (HTTPS), False in dev
        samesite=COOKIE_SAMESITE,  
        path="/",
        max_age=60 * 60 * 24
    )

    return {
        "success": True,
        "message": result["message"],
        "username": result["username"]
    }



@router.get("/me")
def me(
    current_user = Depends(get_current_user)
):

    return {
        "success": True,
        "user": current_user
    }


@router.get("/sessions")
def get_sessions(
    current_user=Depends(get_current_user)
):

    sessions = get_user_sessions(
        current_user["user_id"]
    )

    return {
        "success": True,
        "sessions": sessions
    }



@router.get("/session/{session_id}")
def load_session(
    session_id: str,
    current_user=Depends(get_current_user)
):

    session = get_session_history(
        session_id,
        current_user["user_id"]
    )

    if session is None:

        return {
            "success": False,
            "message": "Session not found."
        }

    return {
        "success": True,
        "session": session
    }




@router.delete("/session/{session_id}")
def delete_chat(
    session_id: str,
    current_user=Depends(get_current_user)
):

    deleted = delete_session(
        session_id,
        current_user["user_id"]
    )

    if not deleted:
        return {
            "success": False,
            "message": "Session not found."
        }

    delete_vector_db(
        current_user["user_id"],
        session_id
    )

    return {
        "success": True,
        "message": "Session deleted."
    }




@router.post("/logout")
def logout(response: Response):

    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=COOKIE_SECURE,      # BUG 5 FIX: Must match set_cookie exactly
        samesite=COOKIE_SAMESITE,  # BUG 5 FIX: Must match set_cookie exactly
        path="/"
    )

    return {
        "success": True,
        "message": "Logged out successfully."
    }



