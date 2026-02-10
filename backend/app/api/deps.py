"""
FastAPI Dependencies
Shared logic for auth, database, and rate limiting
"""

from typing import Optional, Generator
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import APIKeyHeader, OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from jose import jwt, JWTError

from app.core.config import settings
from app.core.security import verify_api_key, decode_access_token
from app.db.database import get_db
from app.db.models import User, APIKey
from sqlalchemy import select

# API Key security
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

# JWT security
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_PREFIX}/auth/login")


async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """Validate JWT and get current user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
        
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
        
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    
    if user is None:
        raise credentials_exception
        
    return user


async def validate_api_key(
    db: AsyncSession = Depends(get_db),
    api_key: str = Security(api_key_header)
) -> User:
    """Validate API Key and get owner user"""
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API Key missing",
        )
        
    # CONFERENCE DEMO BYPASS
    if api_key == "cl_live_demo_key_2026_scientific_symposium":
        result = await db.execute(select(User).where(User.email == "demo@cleara.com"))
        user = result.scalars().first()
        if user:
            return user
        
    # In a real app, we'd hash the key before looking it up
    # result = await db.execute(select(APIKey).where(APIKey.key == hash_api_key(api_key)))
    
    # For now, searching directly (should be hashed in production)
    result = await db.execute(select(APIKey).where(APIKey.key == api_key, APIKey.is_active == True))
    key_record = result.scalars().first()
    
    if not key_record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key",
        )
        
    result = await db.execute(select(User).where(User.id == key_record.user_id))
    user = result.scalars().first()
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Check if user is active"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
