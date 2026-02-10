"""
Database Models for Cleara
SQLAlchemy ORM models for users, API keys, jobs, and usage tracking
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, Text, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import uuid

Base = declarative_base()


class User(Base):
    """User accounts"""
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    
    # Subscription
    subscription_tier = Column(String(50), default="free")  # free, pro, enterprise
    subscription_status = Column(String(50), default="active")  # active, cancelled, expired
    subscription_start = Column(DateTime, default=datetime.utcnow)
    subscription_end = Column(DateTime, nullable=True)
    
    # Usage limits
    monthly_request_limit = Column(Integer, default=1000)
    monthly_requests_used = Column(Integer, default=0)
    
    # Metadata
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    # Relationships
    api_keys = relationship("APIKey", back_populates="user", cascade="all, delete-orphan")
    cleaning_jobs = relationship("CleaningJob", back_populates="user", cascade="all, delete-orphan")
    usage_logs = relationship("UsageLog", back_populates="user", cascade="all, delete-orphan")


class APIKey(Base):
    """API keys for authentication"""
    __tablename__ = "api_keys"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    
    key = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    
    # Permissions
    is_active = Column(Boolean, default=True)
    can_read = Column(Boolean, default=True)
    can_write = Column(Boolean, default=True)
    can_delete = Column(Boolean, default=False)
    
    # Usage tracking
    total_requests = Column(Integer, default=0)
    last_used = Column(DateTime, nullable=True)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="api_keys")


class CleaningJob(Base):
    """Data cleaning job history"""
    __tablename__ = "cleaning_jobs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    
    # Job details
    job_type = Column(String(50), nullable=False)  # clean, validate, deduplicate, ai_clean, etc.
    status = Column(String(50), default="pending")  # pending, processing, completed, failed
    
    # Data
    input_data = Column(JSON)  # Original data
    output_data = Column(JSON)  # Cleaned data
    
    # Metadata
    records_processed = Column(Integer, default=0)
    errors_found = Column(Integer, default=0)
    errors_fixed = Column(Integer, default=0)
    processing_time_ms = Column(Float, default=0.0)
    
    # AI specific
    ai_provider = Column(String(50), nullable=True)  # groq, gemini, huggingface
    ai_model = Column(String(100), nullable=True)
    ai_instructions = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="cleaning_jobs")


class UsageLog(Base):
    """API usage tracking"""
    __tablename__ = "usage_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    
    # Request details
    endpoint = Column(String(255), nullable=False)
    method = Column(String(10), nullable=False)  # GET, POST, etc.
    status_code = Column(Integer)
    
    # Performance
    response_time_ms = Column(Float)
    
    # Metadata
    ip_address = Column(String(50))
    user_agent = Column(String(500))
    api_key_id = Column(String(36), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    user = relationship("User", back_populates="usage_logs")


class Subscription(Base):
    """Subscription plans and pricing"""
    __tablename__ = "subscriptions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Plan details
    name = Column(String(100), nullable=False, unique=True)  # Free, Pro, Enterprise
    description = Column(Text)
    
    # Pricing
    price_monthly = Column(Float, default=0.0)
    price_yearly = Column(Float, default=0.0)
    
    # Limits
    monthly_request_limit = Column(Integer, default=1000)
    max_api_keys = Column(Integer, default=1)
    max_file_size_mb = Column(Integer, default=10)
    
    # Features
    features = Column(JSON)  # List of features
    ai_access = Column(Boolean, default=False)
    priority_support = Column(Boolean, default=False)
    custom_models = Column(Boolean, default=False)
    
    # Metadata
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
