"""
Authentication Routes - Defines API endpoints for authentication
"""
from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from services.auth_service import get_current_active_user, Token
from schemas.user import UserCreate, UserResponse
from controllers import auth_controller

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    """OAuth2 compatible token login, get an access token for future requests"""
    return await auth_controller.login_user(form_data)


@router.post("/register", response_model=UserResponse)
async def register_user(user_data: UserCreate):
    """Register a new user account"""
    return await auth_controller.register_new_user(user_data)


@router.get("/users/me", response_model=UserResponse)
async def read_users_me(
    current_user: Annotated[dict, Depends(get_current_active_user)]
):
    """Get current user information"""
    return await auth_controller.get_current_user_info(current_user)


@router.get("/test-protected")
async def test_protected_route(
    current_user: Annotated[dict, Depends(get_current_active_user)]
):
    """Test route to verify authentication is working"""
    return await auth_controller.test_protected_endpoint(current_user)