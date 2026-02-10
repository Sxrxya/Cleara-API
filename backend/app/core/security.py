"""
Security utilities for Cleara API
JWT tokens, API key management, password hashing
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
import secrets
import hashlib

from app.core.config import settings


# Password hashing context
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


# ============================================================================
# PASSWORD HASHING
# ============================================================================

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)


# ============================================================================
# JWT TOKENS
# ============================================================================

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token
    
    Args:
        data: Payload data to encode
        expires_delta: Token expiration time
        
    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "iss": settings.APP_NAME,
    })
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    
    return encoded_jwt


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and validate a JWT token
    
    Args:
        token: JWT token to decode
        
    Returns:
        Decoded payload or None if invalid
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None


# ============================================================================
# API KEY MANAGEMENT
# ============================================================================

def generate_api_key(prefix: str = "sk") -> str:
    """
    Generate a secure API key
    
    Args:
        prefix: Key prefix (e.g., 'sk' for secret key)
        
    Returns:
        API key in format: prefix_randomstring
    """
    random_part = secrets.token_urlsafe(settings.API_KEY_LENGTH)
    return f"{prefix}_{random_part}"


def hash_api_key(api_key: str) -> str:
    """
    Hash an API key for secure storage
    
    Args:
        api_key: Plain API key
        
    Returns:
        SHA-256 hash of the API key
    """
    return hashlib.sha256(api_key.encode()).hexdigest()


def verify_api_key(plain_key: str, hashed_key: str) -> bool:
    """
    Verify an API key against its hash
    
    Args:
        plain_key: Plain API key
        hashed_key: Hashed API key
        
    Returns:
        True if keys match
    """
    return hash_api_key(plain_key) == hashed_key


# ============================================================================
# REQUEST SIGNING
# ============================================================================

def generate_signature(payload: str, secret: str) -> str:
    """
    Generate HMAC signature for request validation
    
    Args:
        payload: Request payload
        secret: Secret key
        
    Returns:
        HMAC signature
    """
    import hmac
    
    signature = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return signature


def verify_signature(payload: str, signature: str, secret: str) -> bool:
    """
    Verify HMAC signature
    
    Args:
        payload: Request payload
        signature: Provided signature
        secret: Secret key
        
    Returns:
        True if signature is valid
    """
    expected_signature = generate_signature(payload, secret)
    return hmac.compare_digest(signature, expected_signature)


# ============================================================================
# RATE LIMITING
# ============================================================================

def get_rate_limit_key(user_id: str, endpoint: str) -> str:
    """
    Generate rate limit cache key
    
    Args:
        user_id: User identifier
        endpoint: API endpoint
        
    Returns:
        Cache key for rate limiting
    """
    return f"rate_limit:{user_id}:{endpoint}"


def get_usage_key(user_id: str, month: str) -> str:
    """
    Generate usage tracking cache key
    
    Args:
        user_id: User identifier
        month: Month in YYYY-MM format
        
    Returns:
        Cache key for usage tracking
    """
    return f"usage:{user_id}:{month}"
