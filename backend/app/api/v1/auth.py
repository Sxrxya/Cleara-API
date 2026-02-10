"""
Simple Authentication Endpoint - No Database Required
For quick testing and development
"""

from fastapi import APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends
from datetime import timedelta

from app.core.config import settings
from app.core.security import create_access_token, hash_password, verify_password

router = APIRouter()

# Hardcoded demo user (no database needed)
DEMO_USER = {
    "id": 1,
    "email": "demo@cleara.com",
    "hashed_password": "$pbkdf2-sha256$29000$N.Y8R2hNqfU.Z.z9/3//fw$LxzKqZhQ7qH0YqKvJKqKqKqKqKqKqKqKqKqKqKqKqKo",  # demo123
    "full_name": "Demo User",
    "tier": "pro",
    "is_active": True
}


@router.post("/login", tags=["Authentication"])
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Simple login endpoint - uses hardcoded demo user
    
    **Demo Credentials:**
    - Email: demo@cleara.com
    - Password: demo123
    """
    
    # Check if email matches
    if form_data.username != DEMO_USER["email"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check password (simple check for demo)
    if form_data.password != "demo123":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": DEMO_USER["email"], "user_id": DEMO_USER["id"]},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": DEMO_USER["id"],
            "email": DEMO_USER["email"],
            "full_name": DEMO_USER["full_name"],
            "tier": DEMO_USER["tier"]
        }
    }


@router.post("/logout", tags=["Authentication"])
def logout():
    """Logout endpoint"""
    return {"message": "Successfully logged out"}


@router.get("/me", tags=["Authentication"])
def get_current_user_info():
    """Get current user info"""
    return {
        "id": DEMO_USER["id"],
        "email": DEMO_USER["email"],
        "full_name": DEMO_USER["full_name"],
        "tier": DEMO_USER["tier"],
        "is_active": DEMO_USER["is_active"]
    }
