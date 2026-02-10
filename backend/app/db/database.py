"""
Database configuration and session management
Supports both SQLite (local) and PostgreSQL (production)
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import os
from typing import AsyncGenerator

from app.db.models import Base

# Get database URL from environment or use SQLite
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite+aiosqlite:///./cleara.db"  # Local SQLite database
)

# For PostgreSQL in production, convert URL if needed
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)

# Create async engine
if "sqlite" in DATABASE_URL:
    # SQLite configuration
    engine = create_async_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        echo=True  # Set to False in production
    )
else:
    # PostgreSQL configuration
    engine = create_async_engine(
        DATABASE_URL,
        echo=True,  # Set to False in production
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20
    )

# Create async session factory
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)


async def init_db():
    """Initialize database - create all tables"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Database initialized successfully!")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency for getting database session
    Use in FastAPI endpoints like:
    
    @app.get("/users")
    async def get_users(db: AsyncSession = Depends(get_db)):
        ...
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def close_db():
    """Close database connection"""
    await engine.dispose()
    print("✅ Database connection closed!")