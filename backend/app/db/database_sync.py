"""
Simple synchronous database setup for development
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.db.models import Base, User
from app.core.security import hash_password
import os

# Use synchronous SQLite
DATABASE_URL = "sqlite:///./cleara.db"

# Create sync engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=True
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db_sync():
    """Get synchronous database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db_sync():
    """Initialize database with demo user"""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create demo user
    db = SessionLocal()
    try:
        # Check if demo user exists
        existing_user = db.query(User).filter(User.email == "demo@cleara.com").first()
        
        if not existing_user:
            demo_user = User(
                email="demo@cleara.com",
                hashed_password=hash_password("demo123"),
                full_name="Demo User",
                tier="pro",
                is_active=True
            )
            db.add(demo_user)
            db.commit()
            print("✅ Demo user created: demo@cleara.com / demo123")
        else:
            print("✅ Demo user already exists")
            
    finally:
        db.close()


if __name__ == "__main__":
    print("Initializing database...")
    init_db_sync()
    print("✅ Database ready!")
