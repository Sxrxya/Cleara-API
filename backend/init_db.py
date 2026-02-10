"""
Initialize Cleara Database
Creates all tables and adds default data
"""

import asyncio
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db import init_db, AsyncSessionLocal, User, Subscription
from passlib.context import CryptContext
from datetime import datetime, timedelta

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


async def create_default_subscriptions():
    """Create default subscription plans"""
    async with AsyncSessionLocal() as session:
        # Check if subscriptions already exist
        from sqlalchemy import select
        result = await session.execute(select(Subscription))
        existing = result.scalars().first()
        
        if existing:
            print("⏭️  Subscriptions already exist, skipping...")
            return
        
        subscriptions = [
            Subscription(
                name="Free",
                description="Perfect for trying out Cleara",
                price_monthly=0.0,
                price_yearly=0.0,
                monthly_request_limit=1000,
                max_api_keys=1,
                max_file_size_mb=10,
                features=["1,000 requests/month", "Basic data cleaning", "Email support"],
                ai_access=False,
                priority_support=False,
                custom_models=False
            ),
            Subscription(
                name="Pro",
                description="For professionals and small teams",
                price_monthly=29.0,
                price_yearly=290.0,
                monthly_request_limit=50000,
                max_api_keys=5,
                max_file_size_mb=100,
                features=[
                    "50,000 requests/month",
                    "AI-powered cleaning",
                    "Advanced validation",
                    "Priority support",
                    "Custom models"
                ],
                ai_access=True,
                priority_support=True,
                custom_models=False
            ),
            Subscription(
                name="Enterprise",
                description="For large organizations",
                price_monthly=99.0,
                price_yearly=990.0,
                monthly_request_limit=500000,
                max_api_keys=50,
                max_file_size_mb=1000,
                features=[
                    "500,000 requests/month",
                    "AI-powered cleaning",
                    "Advanced validation",
                    "24/7 priority support",
                    "Custom AI models",
                    "Dedicated account manager",
                    "SLA guarantee"
                ],
                ai_access=True,
                priority_support=True,
                custom_models=True
            )
        ]
        
        session.add_all(subscriptions)
        await session.commit()
        print("✅ Created default subscription plans")


async def create_demo_user():
    """Create a demo user for testing"""
    async with AsyncSessionLocal() as session:
        # Check if demo user already exists
        from sqlalchemy import select
        result = await session.execute(
            select(User).where(User.email == "demo@cleara.com")
        )
        existing = result.scalars().first()
        
        if existing:
            print("⏭️  Demo user already exists, skipping...")
            return
        
        # Create demo user
        demo_user = User(
            email="demo@cleara.com",
            username="demo",
            hashed_password=pwd_context.hash("demo123"),
            full_name="Demo User",
            subscription_tier="pro",
            subscription_status="active",
            subscription_start=datetime.utcnow(),
            subscription_end=datetime.utcnow() + timedelta(days=365),
            monthly_request_limit=50000,
            monthly_requests_used=0,
            is_active=True,
            is_verified=True
        )
        
        session.add(demo_user)
        await session.commit()
        print("✅ Created demo user:")
        print("   Email: demo@cleara.com")
        print("   Password: demo123")


async def main():
    """Main initialization function"""
    print("=" * 60)
    print("  CLEARA DATABASE INITIALIZATION")
    print("=" * 60)
    print()
    
    try:
        # Step 1: Create tables
        print("[1/3] Creating database tables...")
        await init_db()
        print()
        
        # Step 2: Create default subscriptions
        print("[2/3] Creating default subscription plans...")
        await create_default_subscriptions()
        print()
        
        # Step 3: Create demo user
        print("[3/3] Creating demo user...")
        await create_demo_user()
        print()
        
        print("=" * 60)
        print("  ✅ DATABASE INITIALIZED SUCCESSFULLY!")
        print("=" * 60)
        print()
        print("📊 Database: cleara.db (SQLite)")
        print("👤 Demo User:")
        print("   Email: demo@cleara.com")
        print("   Password: demo123")
        print()
        print("🚀 Next steps:")
        print("   1. Start backend: uvicorn app.main:app --reload")
        print("   2. Start frontend: npm run dev")
        print("   3. Login with demo credentials")
        print()
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
