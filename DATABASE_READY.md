# 🗄️ DATABASE SETUP COMPLETE!

## ✅ **WHAT I'VE CREATED**

I've set up a complete database system for Cleara!

### **Database Files:**

1. ✅ `backend/app/db/models.py` - Database models (Users, API Keys, Jobs, etc.)
2. ✅ `backend/app/db/database.py` - Database configuration
3. ✅ `backend/app/db/__init__.py` - Package init
4. ✅ `backend/init_db.py` - Database initialization script

### **Database Tables:**

- ✅ **users** - User accounts and subscriptions
- ✅ **api_keys** - API key management
- ✅ **cleaning_jobs** - Data cleaning history
- ✅ **usage_logs** - API usage tracking
- ✅ **subscriptions** - Subscription plans (Free, Pro, Enterprise)

---

## 🚀 **QUICK START (3 STEPS)**

### **Step 1: Install Database Packages** (2 minutes)

```bash
cd backend
pip install sqlalchemy aiosqlite asyncpg alembic passlib
```

### **Step 2: Initialize Database** (1 minute)

```bash
python init_db.py
```

This will:
- ✅ Create `cleara.db` (SQLite database)
- ✅ Create all tables
- ✅ Add default subscription plans (Free, Pro, Enterprise)
- ✅ Create demo user (email: demo@cleara.com, password: demo123)

### **Step 3: Start Everything** (1 minute)

```bash
# Double-click:
START_ALL.bat

# Or manually:
# Terminal 1:
cd backend
uvicorn app.main:app --reload

# Terminal 2:
cd frontend
npm run dev
```

---

## 🎯 **DEMO USER CREDENTIALS**

After running `init_db.py`, you'll have a demo user:

```
Email: demo@cleara.com
Password: demo123
Subscription: Pro
Monthly Limit: 50,000 requests
```

Use these to test the application!

---

## 📊 **DATABASE SCHEMA**

### **Users Table:**
```sql
- id (UUID)
- email (unique)
- username (unique)
- hashed_password
- full_name
- subscription_tier (free/pro/enterprise)
- subscription_status
- monthly_request_limit
- monthly_requests_used
- is_active
- is_verified
- created_at
- updated_at
```

### **API Keys Table:**
```sql
- id (UUID)
- user_id (foreign key)
- key (unique)
- name
- is_active
- permissions (read/write/delete)
- total_requests
- last_used
- created_at
- expires_at
```

### **Cleaning Jobs Table:**
```sql
- id (UUID)
- user_id (foreign key)
- job_type (clean/validate/deduplicate/ai_clean)
- status (pending/processing/completed/failed)
- input_data (JSON)
- output_data (JSON)
- records_processed
- errors_found
- errors_fixed
- processing_time_ms
- ai_provider (groq/gemini/huggingface)
- created_at
- completed_at
```

---

## 💾 **DATABASE LOCATION**

### **Local Development (SQLite):**
```
backend/cleara.db
```

This is a file-based database - no server needed!

### **Production (PostgreSQL):**
Set environment variable:
```env
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/dbname
```

The code automatically switches between SQLite and PostgreSQL!

---

## 🔧 **HOW TO USE IN CODE**

### **Get Database Session:**

```python
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db, User

@app.get("/users")
async def get_users(db: AsyncSession = Depends(get_db)):
    from sqlalchemy import select
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users
```

### **Create User:**

```python
from app.db import User, get_db
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"])

async def create_user(email: str, password: str, db: AsyncSession):
    user = User(
        email=email,
        username=email.split('@')[0],
        hashed_password=pwd_context.hash(password),
        subscription_tier="free",
        monthly_request_limit=1000
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
```

### **Track Cleaning Job:**

```python
from app.db import CleaningJob

async def save_cleaning_job(user_id: str, data: dict, result: dict, db: AsyncSession):
    job = CleaningJob(
        user_id=user_id,
        job_type="ai_clean",
        status="completed",
        input_data=data,
        output_data=result,
        records_processed=1,
        ai_provider="groq"
    )
    db.add(job)
    await db.commit()
```

---

## 🎯 **SUBSCRIPTION PLANS**

The database comes with 3 default plans:

### **Free Plan:**
- 💰 $0/month
- 📊 1,000 requests/month
- 🔑 1 API key
- 📁 10MB max file size
- ❌ No AI access

### **Pro Plan:**
- 💰 $29/month ($290/year)
- 📊 50,000 requests/month
- 🔑 5 API keys
- 📁 100MB max file size
- ✅ AI access
- ✅ Priority support

### **Enterprise Plan:**
- 💰 $99/month ($990/year)
- 📊 500,000 requests/month
- 🔑 50 API keys
- 📁 1GB max file size
- ✅ AI access
- ✅ 24/7 support
- ✅ Custom models
- ✅ SLA guarantee

---

## 🐛 **TROUBLESHOOTING**

### **"No module named 'sqlalchemy'"**

**Solution:**
```bash
cd backend
pip install sqlalchemy aiosqlite passlib
```

### **"Database is locked"**

**Solution:** Close all connections and restart:
```bash
# Delete database file
rm cleara.db

# Reinitialize
python init_db.py
```

### **"Table already exists"**

**Solution:** Database already initialized! Just start the backend:
```bash
uvicorn app.main:app --reload
```

---

## 📝 **NEXT STEPS**

### **1. Initialize Database:**

```bash
cd backend
pip install sqlalchemy aiosqlite passlib
python init_db.py
```

### **2. Start Backend:**

```bash
uvicorn app.main:app --reload
```

### **3. Test Database:**

Go to: http://localhost:8000/docs

Try the endpoints!

### **4. Login with Demo User:**

```
Email: demo@cleara.com
Password: demo123
```

---

## 🌐 **PRODUCTION DEPLOYMENT**

When ready to deploy, see: `FREE_DEPLOYMENT_GUIDE.md`

It includes:
- ✅ PostgreSQL setup
- ✅ Free hosting options (Render, Railway)
- ✅ Environment variables
- ✅ Migration guide

---

## 🎉 **YOU'RE READY!**

### **What You Have:**
✅ SQLite database (local)  
✅ 5 database tables  
✅ Demo user account  
✅ 3 subscription plans  
✅ Database models  
✅ Async database access  

### **What You Can Do:**
✅ Store user data  
✅ Track API usage  
✅ Save cleaning jobs  
✅ Manage subscriptions  
✅ Generate API keys  

### **Start Now:**

```bash
# 1. Install packages
cd backend
pip install sqlalchemy aiosqlite passlib

# 2. Initialize database
python init_db.py

# 3. Start backend
uvicorn app.main:app --reload
```

**Database ready! No server needed! 🚀**
