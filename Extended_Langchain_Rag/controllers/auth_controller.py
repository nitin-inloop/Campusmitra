"""
Auth Controller - Handles authentication business logic
"""
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from services.auth_service import (
    authenticate_user, 
    create_access_token, 
    get_current_active_user, 
    create_user,
    Token,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from schemas.user import UserCreate, UserResponse


async def login_user(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]) -> Token:
    """Handle user login and token generation"""
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


async def register_new_user(user_data: UserCreate) -> UserResponse:
    """Handle new user registration"""
    try:
        user = await create_user(user_data)
        return UserResponse(
            id=str(user["_id"]),
            username=user["username"],
            email=user["email"],
            created_at=user["created_at"],
            is_active=user["is_active"]
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {str(e)}"
        )


async def get_current_user_info(current_user: dict) -> UserResponse:
    """Get current user information"""
    return UserResponse(
        id=str(current_user["_id"]),
        username=current_user["username"],
        email=current_user["email"],
        created_at=current_user["created_at"],
        is_active=current_user["is_active"]
    )


async def test_protected_endpoint(current_user: dict) -> dict:
    """Test endpoint to verify authentication"""
    return {"message": f"Hello {current_user['username']}, this is a protected route!"}