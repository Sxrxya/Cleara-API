# 🚀 HOW TO RUN CLEARA - Complete Guide

## 📋 **Prerequisites**

Before you start, make sure you have:
- ✅ Python 3.11 or higher
- ✅ Node.js 18 or higher
- ✅ npm (comes with Node.js)

---

## 🎯 **Quick Start (2 Terminals)**

### **Terminal 1: Backend (Python/FastAPI)**

```powershell
# Navigate to backend folder
cd "C:\Users\welcome\OneDrive\Desktop\Cleara API\Cleara-API\backend"

# Install dependencies (first time only)
pip install -r requirements.txt

# Initialize database (first time only)
python init_db.py

# Start the backend server
python -m uvicorn app.main:app --reload --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete. Version: 1.0.0
```

**✅ Backend is ready when you see**: "Application startup complete"

---

### **Terminal 2: Frontend (Next.js/React)**

```powershell
# Navigate to frontend folder
cd "C:\Users\welcome\OneDrive\Desktop\Cleara API\Cleara-API\frontend"

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

**Expected Output:**
```
▲ Next.js 14.1.0
- Local:        http://localhost:3000
✓ Ready in 3s
```

**✅ Frontend is ready when you see**: "Ready in Xs"

---

## 🌐 **Access the Application**

Once both servers are running:

### **Main Application**
- **URL**: http://localhost:3000
- **Login**: Click "Get Started" or go to http://localhost:3000/login

### **Demo Credentials**
- **Email**: `demo@cleara.com`
- **Password**: `demo123`

### **API Documentation**
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

---

## 📂 **Project Structure**

```
Cleara-API/
├── backend/              # Python FastAPI backend
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── services/    # Business logic
│   │   ├── db/          # Database models
│   │   └── core/        # Configuration
│   ├── init_db.py       # Database initialization
│   └── requirements.txt # Python dependencies
│
└── frontend/            # Next.js React frontend
    ├── src/app/         # Pages and components
    ├── public/          # Static assets
    └── package.json     # Node dependencies
```

---

## 🔧 **Troubleshooting**

### **Backend Issues**

#### **Problem**: "ModuleNotFoundError: No module named 'app'"
**Solution**: Make sure you're in the `backend` folder
```powershell
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

#### **Problem**: "Port 8000 is already in use"
**Solution**: Kill the existing process or use a different port
```powershell
# Use a different port
python -m uvicorn app.main:app --reload --port 8001

# Or kill existing process
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process
```

#### **Problem**: Missing dependencies
**Solution**: Install all requirements
```powershell
pip install -r requirements.txt
```

---

### **Frontend Issues**

#### **Problem**: "Cannot find module 'next'"
**Solution**: Install dependencies
```powershell
npm install
```

#### **Problem**: "Port 3000 is already in use"
**Solution**: Next.js will automatically suggest port 3001
```
? Port 3000 is in use, would you like to use 3001 instead? › (Y/n)
```
Press `Y` to use the suggested port.

#### **Problem**: Build errors
**Solution**: Clear cache and reinstall
```powershell
rm -r node_modules
rm package-lock.json
npm install
```

---

## 🎨 **Available Pages**

Once running, you can access:

| Page | URL | Description |
|------|-----|-------------|
| **Home** | http://localhost:3000 | Landing page |
| **Login** | http://localhost:3000/login | Authentication |
| **Dashboard** | http://localhost:3000/dashboard | Main dashboard |
| **Intelligence** | http://localhost:3000/intelligence | AI Intelligence Layer |
| **Playground** | http://localhost:3000/playground | Interactive testing |
| **Pricing** | http://localhost:3000/pricing | Pricing plans |
| **Docs** | http://localhost:3000/docs | Documentation |

---

## 🧪 **Testing the System**

### **1. Test Backend Health**
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/health"
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "Cleara API",
  "version": "1.0.0"
}
```

### **2. Test Login API**
```powershell
$body = @{
    username = "demo@cleara.com"
    password = "demo123"
}

Invoke-RestMethod -Uri "http://localhost:8000/v1/auth/login" -Method POST -Body $body -ContentType "application/x-www-form-urlencoded"
```

**Expected Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### **3. Test Frontend**
Open http://localhost:3000 in your browser and verify:
- ✅ Page loads without errors
- ✅ Navigation works
- ✅ Login page is accessible

---

## 🔄 **Development Workflow**

### **Making Changes**

**Backend Changes:**
- Edit files in `backend/app/`
- Server auto-reloads (thanks to `--reload` flag)
- Check terminal for errors

**Frontend Changes:**
- Edit files in `frontend/src/`
- Browser auto-refreshes (Hot Module Replacement)
- Check browser console for errors

### **Stopping the Servers**

**In each terminal, press**: `Ctrl + C`

---

## 📦 **Production Deployment**

### **Backend (Production)**
```powershell
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### **Frontend (Production)**
```powershell
cd frontend
npm run build
npm start
```

---

## 🎯 **Quick Commands Reference**

### **Backend**
```powershell
# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py

# Run development server
python -m uvicorn app.main:app --reload --port 8000

# Run production server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### **Frontend**
```powershell
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Run linter
npm run lint
```

---

## 🆘 **Getting Help**

If you encounter issues:

1. **Check the logs** in both terminal windows
2. **Verify both servers are running**:
   - Backend: http://localhost:8000/health
   - Frontend: http://localhost:3000
3. **Check the documentation**:
   - [COMPLETE_GUIDE.md](./COMPLETE_GUIDE.md)
   - [TROUBLESHOOTING_LOGIN.md](./TROUBLESHOOTING_LOGIN.md)
   - [QUICK_START.md](./QUICK_START.md)

---

## ✅ **Success Checklist**

Before using Cleara, verify:

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:8000/health
- [ ] Can access http://localhost:3000
- [ ] Can login with demo@cleara.com / demo123
- [ ] Dashboard loads after login

---

**You're all set! Enjoy using Cleara! 🎉**
