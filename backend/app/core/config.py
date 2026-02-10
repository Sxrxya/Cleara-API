"""
Simplified Core Configuration for Cleara API
"""

from typing import List
import os


class Settings:
    """Application settings"""
    
    # Application
    APP_NAME: str = "Cleara API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = True
    
    # API Configuration
    API_PREFIX: str = "/v1"
    API_V1_PREFIX: str = "/v1"  # Alias for compatibility
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000", "*"]
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "cleara-dev-secret-key-change-in-production-12345")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    API_KEY_LENGTH: int = 32
    
    # AI API Keys
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    HUGGINGFACE_API_KEY: str = os.getenv("HUGGINGFACE_API_KEY", "")
    
    # AWS Configuration (optional)
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./cleara.db")
    
    # Rate Limiting
    RATE_LIMIT_FREE: int = 500
    RATE_LIMIT_PRO: int = 100_000
    RATE_LIMIT_GROWTH: int = 1_000_000
    RATE_LIMIT_ENTERPRISE: int = -1
    
    # ML Models
    MODEL_CACHE_DIR: str = "./models"
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    DEDUP_THRESHOLD: float = 0.85
    MAX_BATCH_SIZE: int = 100
    
    # Performance
    MAX_WORKERS: int = 4
    REQUEST_TIMEOUT: int = 30
    MAX_RETRIES: int = 3
    
    # Monitoring
    LOG_LEVEL: str = "INFO"


# Create settings instance
settings = Settings()


# Pricing tiers
PRICING_TIERS = {
    "free": {
        "name": "Free",
        "price": 0,
        "requests_per_month": 500,
        "projects": 1,
        "support": "community",
        "sla": None,
    },
    "pro": {
        "name": "Pro",
        "price": 799,
        "requests_per_month": 100_000,
        "projects": 5,
        "support": "priority",
        "sla": "99.9%",
    },
    "growth": {
        "name": "Growth",
        "price": 4_999,
        "requests_per_month": 1_000_000,
        "projects": -1,
        "support": "dedicated",
        "sla": "99.95%",
    },
    "enterprise": {
        "name": "Enterprise",
        "price": None,
        "requests_per_month": -1,
        "projects": -1,
        "support": "dedicated",
        "sla": "99.99%",
    },
}
