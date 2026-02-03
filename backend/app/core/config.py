"""
Core Configuration for Cleara API
Environment-based settings using Pydantic Settings
"""

from pydantic_settings import BaseSettings
from pydantic import Field, validator
from typing import List, Optional
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    APP_NAME: str = "Cleara API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = Field(default="development", env="ENVIRONMENT")
    DEBUG: bool = Field(default=True, env="DEBUG")
    
    # API Configuration
    API_PREFIX: str = "/v1"
    ALLOWED_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:8000"],
        env="ALLOWED_ORIGINS"
    )
    
    # Security
    SECRET_KEY: str = Field(
        default="your-secret-key-change-in-production",
        env="SECRET_KEY"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    API_KEY_LENGTH: int = 32
    
    # AWS Configuration
    AWS_REGION: str = Field(default="us-east-1", env="AWS_REGION")
    AWS_ACCESS_KEY_ID: Optional[str] = Field(default=None, env="AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY: Optional[str] = Field(default=None, env="AWS_SECRET_ACCESS_KEY")
    
    # DynamoDB Tables
    DYNAMODB_USERS_TABLE: str = Field(default="cleara-users", env="DYNAMODB_USERS_TABLE")
    DYNAMODB_API_KEYS_TABLE: str = Field(default="cleara-api-keys", env="DYNAMODB_API_KEYS_TABLE")
    DYNAMODB_USAGE_TABLE: str = Field(default="cleara-usage", env="DYNAMODB_USAGE_TABLE")
    
    # S3 Buckets
    S3_MODELS_BUCKET: str = Field(default="cleara-ml-models", env="S3_MODELS_BUCKET")
    S3_LOGS_BUCKET: str = Field(default="cleara-logs", env="S3_LOGS_BUCKET")
    
    # Redis Configuration
    REDIS_HOST: str = Field(default="localhost", env="REDIS_HOST")
    REDIS_PORT: int = Field(default=6379, env="REDIS_PORT")
    REDIS_PASSWORD: Optional[str] = Field(default=None, env="REDIS_PASSWORD")
    REDIS_DB: int = Field(default=0, env="REDIS_DB")
    CACHE_TTL: int = 3600  # 1 hour
    
    # Rate Limiting
    RATE_LIMIT_FREE: int = 500  # requests per month
    RATE_LIMIT_PRO: int = 100_000
    RATE_LIMIT_GROWTH: int = 1_000_000
    RATE_LIMIT_ENTERPRISE: int = -1  # unlimited
    
    # ML Models Configuration
    MODEL_CACHE_DIR: str = Field(default="./models", env="MODEL_CACHE_DIR")
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    DEDUP_THRESHOLD: float = 0.85
    MAX_BATCH_SIZE: int = 100
    
    # Performance
    MAX_WORKERS: int = 4
    REQUEST_TIMEOUT: int = 30
    MAX_RETRIES: int = 3
    
    # Monitoring
    ENABLE_XRAY: bool = Field(default=False, env="ENABLE_XRAY")
    LOG_LEVEL: str = Field(default="INFO", env="LOG_LEVEL")
    
    # Stripe Configuration
    STRIPE_SECRET_KEY: Optional[str] = Field(default=None, env="STRIPE_SECRET_KEY")
    STRIPE_PUBLISHABLE_KEY: Optional[str] = Field(default=None, env="STRIPE_PUBLISHABLE_KEY")
    STRIPE_WEBHOOK_SECRET: Optional[str] = Field(default=None, env="STRIPE_WEBHOOK_SECRET")
    
    # Pricing (in INR)
    PRICE_PRO_MONTHLY: int = 799
    PRICE_GROWTH_MONTHLY: int = 4999
    
    @validator("ENVIRONMENT")
    def validate_environment(cls, v):
        """Validate environment value"""
        allowed = ["development", "staging", "production"]
        if v not in allowed:
            raise ValueError(f"ENVIRONMENT must be one of {allowed}")
        return v
    
    @validator("ALLOWED_ORIGINS", pre=True)
    def parse_allowed_origins(cls, v):
        """Parse ALLOWED_ORIGINS from string or list"""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Create settings instance
settings = Settings()


# ============================================================================
# PRICING TIERS
# ============================================================================

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
        "projects": -1,  # unlimited
        "support": "dedicated",
        "sla": "99.95%",
    },
    "enterprise": {
        "name": "Enterprise",
        "price": None,  # custom
        "requests_per_month": -1,  # unlimited
        "projects": -1,  # unlimited
        "support": "dedicated",
        "sla": "99.99%",
    },
}


# ============================================================================
# ERROR CODES
# ============================================================================

ERROR_CODES = {
    # Authentication Errors (1xxx)
    1000: "Invalid API key",
    1001: "API key expired",
    1002: "API key revoked",
    1003: "Insufficient permissions",
    1004: "Invalid JWT token",
    
    # Rate Limiting Errors (2xxx)
    2000: "Rate limit exceeded",
    2001: "Monthly quota exceeded",
    2002: "Concurrent request limit exceeded",
    
    # Validation Errors (3xxx)
    3000: "Invalid input data",
    3001: "Missing required field",
    3002: "Invalid data type",
    3003: "Data too large",
    3004: "Invalid format",
    
    # Processing Errors (4xxx)
    4000: "Processing failed",
    4001: "Model inference failed",
    4002: "Timeout",
    4003: "Service unavailable",
    
    # Business Logic Errors (5xxx)
    5000: "Subscription required",
    5001: "Payment failed",
    5002: "Account suspended",
    5003: "Feature not available in current plan",
}
