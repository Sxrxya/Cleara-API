# Test Backend Connection

## Quick Backend Health Check

Open PowerShell and run these commands one by one:

### 1. Check if backend is running
```powershell
# Try to access the health endpoint
Invoke-RestMethod -Uri "http://localhost:8000/health"
```

**Expected output**: `{"status": "healthy"}` or similar

**If you get an error**: Backend is not running. Start it with:
```powershell
cd "C:\Users\welcome\OneDrive\Desktop\Cleara API\Cleara-API\backend"
python -m uvicorn app.main:app --reload --port 8000
```

---

### 2. Test the login endpoint
```powershell
$body = @{
    username = "demo@cleara.com"
    password = "demo123"
}

Invoke-RestMethod -Uri "http://localhost:8000/v1/auth/login" -Method POST -Body $body -ContentType "application/x-www-form-urlencoded"
```

**Expected output**: JSON with `access_token`

---

### 3. Initialize the database (if needed)
```powershell
cd "C:\Users\welcome\OneDrive\Desktop\Cleara API\Cleara-API\backend"
python init_db.py
```

This creates the demo user with credentials:
- Email: `demo@cleara.com`
- Password: `demo123`

---

## Common Issues & Fixes

### Issue 1: "Failed to fetch"
**Cause**: Backend not running  
**Fix**: Start backend with `python -m uvicorn app.main:app --reload --port 8000`

### Issue 2: "Connection refused"
**Cause**: Wrong port or backend crashed  
**Fix**: Check backend terminal for errors, restart if needed

### Issue 3: "Invalid credentials"
**Cause**: Database not initialized  
**Fix**: Run `python init_db.py` in backend folder

### Issue 4: CORS error
**Cause**: Frontend and backend on different origins  
**Fix**: Backend should already have CORS enabled for localhost:3000

---

## Step-by-Step: Start Everything

### Terminal 1 (Backend):
```powershell
cd "C:\Users\welcome\OneDrive\Desktop\Cleara API\Cleara-API\backend"
python init_db.py
python -m uvicorn app.main:app --reload --port 8000
```

### Terminal 2 (Frontend):
```powershell
cd "C:\Users\welcome\OneDrive\Desktop\Cleara API\Cleara-API\frontend"
npm run dev
```

### Browser:
1. Go to http://localhost:3000/login
2. Click "Auto-fill demo credentials"
3. Click "Sign In"

---

## Verify Backend is Working

Open browser and visit:
- http://localhost:8000/docs (API documentation)
- http://localhost:8000/health (Health check)

If both work, the backend is ready!
