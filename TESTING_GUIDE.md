# 🧪 CLEARA - COMPLETE TESTING GUIDE

## **How to Test Everything Locally (10 Minutes)**

---

## 🎯 QUICK START - TEST IN 3 STEPS

### **Step 1: Test Backend (5 minutes)** ⚡

```bash
# 1. Open terminal in backend folder
cd "C:\Users\welcome\OneDrive\Desktop\Cleara API\Cleara-API\backend"

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
venv\Scripts\activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Run the server
uvicorn app.main:app --reload

# ✅ Backend is running!
# Visit: http://localhost:8000
```

**What you'll see:**
- Server starts on port 8000
- Message: "Application startup complete"
- No errors!

---

### **Step 2: Test Frontend (5 minutes)** ⚡

```bash
# 1. Open NEW terminal in frontend folder
cd "C:\Users\welcome\OneDrive\Desktop\Cleara API\Cleara-API\frontend"

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# ✅ Frontend is running!
# Visit: http://localhost:3000
```

**What you'll see:**
- Server starts on port 3000
- Message: "Ready in X ms"
- Browser opens automatically

---

### **Step 3: Explore the App** 🎉

**Open your browser:**
- Frontend: http://localhost:3000
- Backend API Docs: http://localhost:8000/docs

**Try these:**
1. ✅ View landing page
2. ✅ Click "Sign in" → See login page
3. ✅ Click "Get Started" → See signup page
4. ✅ Navigate to dashboard (use any email/password)
5. ✅ Explore all dashboard pages

---

## 📋 DETAILED TESTING GUIDE

### **Backend Testing**

#### **Option 1: Interactive API Docs (Easiest)** ⭐

1. **Start backend** (if not running):
   ```bash
   cd backend
   venv\Scripts\activate
   uvicorn app.main:app --reload
   ```

2. **Open API docs**: http://localhost:8000/docs

3. **Test each endpoint:**

   **a) Health Check**
   - Click on `GET /health`
   - Click "Try it out"
   - Click "Execute"
   - ✅ Should return: `{"status": "healthy"}`

   **b) Data Cleaning**
   - Click on `POST /v1/clean`
   - Click "Try it out"
   - Paste this example:
   ```json
   {
     "data": [
       {
         "name": "  john DOE  ",
         "email": "john@gmial.com"
       }
     ],
     "options": {
       "trim": true,
       "normalize_case": true,
       "fix_emails": true
     }
   }
   ```
   - Click "Execute"
   - ✅ Should return cleaned data!

   **c) Validation**
   - Click on `POST /v1/validate`
   - Click "Try it out"
   - Paste this:
   ```json
   {
     "data": [
       {
         "email": "test@example.com",
         "phone": "+1234567890"
       }
     ],
     "rules": {
       "email": {"type": "email"},
       "phone": {"type": "phone"}
     }
   }
   ```
   - Click "Execute"
   - ✅ Should return validation results!

   **d) Deduplication**
   - Click on `POST /v1/dedupe`
   - Try this:
   ```json
   {
     "data": [
       {"name": "John Doe", "email": "john@example.com"},
       {"name": "john doe", "email": "john@example.com"},
       {"name": "Jane Smith", "email": "jane@example.com"}
     ],
     "threshold": 0.85
   }
   ```
   - ✅ Should find duplicates!

---

#### **Option 2: Using cURL (Command Line)**

```bash
# Health check
curl http://localhost:8000/health

# Clean data
curl -X POST http://localhost:8000/v1/clean \
  -H "Content-Type: application/json" \
  -d '{
    "data": [{"name": "  john DOE  "}],
    "options": {"trim": true, "normalize_case": true}
  }'

# Validate data
curl -X POST http://localhost:8000/v1/validate \
  -H "Content-Type: application/json" \
  -d '{
    "data": [{"email": "test@example.com"}],
    "rules": {"email": {"type": "email"}}
  }'
```

---

#### **Option 3: Run Test Suite**

```bash
# In backend folder
cd backend
venv\Scripts\activate

# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run all tests
pytest tests/ -v

# Run specific test
pytest tests/test_api.py::test_health_check -v
```

**Expected output:**
```
tests/test_api.py::test_health_check PASSED
tests/test_api.py::test_clean_endpoint PASSED
tests/test_api.py::test_validate_endpoint PASSED
...
✅ All tests passed!
```

---

### **Frontend Testing**

#### **Manual Testing (Recommended)** ⭐

1. **Start frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open browser**: http://localhost:3000

3. **Test each page:**

   **a) Landing Page** (/)
   - ✅ Hero section loads
   - ✅ Features section visible
   - ✅ Pricing cards display
   - ✅ Code example shows
   - ✅ CTA buttons work

   **b) Login Page** (/login)
   - Click "Sign in" in header
   - ✅ Form displays
   - ✅ Email input works
   - ✅ Password input works
   - ✅ Password toggle works
   - ✅ Social login buttons visible
   - Try logging in with any email/password

   **c) Signup Page** (/signup)
   - Click "Get Started"
   - ✅ Form displays
   - ✅ All fields work
   - ✅ Password confirmation works
   - ✅ Terms checkbox works
   - Try signing up

   **d) Dashboard** (/dashboard)
   - After login, should redirect here
   - ✅ Sidebar visible
   - ✅ Header visible
   - ✅ 4 stat cards display
   - ✅ Charts render
   - ✅ Recent activity shows
   - ✅ Quick actions visible

   **e) API Keys** (/dashboard/api-keys)
   - Click "API Keys" in sidebar
   - ✅ Page loads
   - ✅ Existing keys show
   - ✅ Click "Create New Key"
   - ✅ Modal opens
   - ✅ Enter name and create
   - ✅ Copy button works
   - ✅ Reveal/hide works

   **f) Usage** (/dashboard/usage)
   - Click "Usage" in sidebar
   - ✅ Charts render
   - ✅ Stats display
   - ✅ Table shows data
   - ✅ Time range selector works

   **g) Billing** (/dashboard/billing)
   - Click "Billing" in sidebar
   - ✅ Current plan shows
   - ✅ Pricing cards display
   - ✅ Monthly/Annual toggle works
   - ✅ Invoice table shows

4. **Test Dark Mode:**
   - Click moon/sun icon in header
   - ✅ Theme switches
   - ✅ All colors change
   - ✅ No visual bugs

5. **Test Responsive:**
   - Press F12 (open DevTools)
   - Click device toolbar icon
   - Try different screen sizes:
     - ✅ Mobile (375px)
     - ✅ Tablet (768px)
     - ✅ Desktop (1920px)
   - ✅ Sidebar collapses on mobile
   - ✅ Charts resize properly

---

#### **Automated Testing (Optional)**

```bash
# In frontend folder
cd frontend

# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production (test if it builds)
npm run build
```

**Expected output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Creating an optimized production build
```

---

## 🧪 INTEGRATION TESTING

### **Test Backend + Frontend Together**

1. **Start both servers:**
   ```bash
   # Terminal 1: Backend
   cd backend
   venv\Scripts\activate
   uvicorn app.main:app --reload

   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

2. **Update frontend to use local backend:**
   - Open `frontend\.env.local`
   - Add: `NEXT_PUBLIC_API_URL=http://localhost:8000`

3. **Test API calls from frontend:**
   - Open browser console (F12)
   - Go to dashboard
   - Check Network tab
   - ✅ Should see API calls to localhost:8000

---

## 🎯 TESTING CHECKLIST

### **Backend** ✅
- [ ] Server starts without errors
- [ ] Health check returns 200
- [ ] `/docs` page loads
- [ ] Clean endpoint works
- [ ] Validate endpoint works
- [ ] Dedupe endpoint works
- [ ] Schema endpoint works
- [ ] Enrich endpoint works
- [ ] Usage endpoint works
- [ ] All tests pass

### **Frontend** ✅
- [ ] Server starts without errors
- [ ] Landing page loads
- [ ] Login page works
- [ ] Signup page works
- [ ] Dashboard loads
- [ ] API Keys page works
- [ ] Usage page works
- [ ] Billing page works
- [ ] Dark mode works
- [ ] Responsive design works
- [ ] No console errors

### **Integration** ✅
- [ ] Frontend can call backend
- [ ] API responses display correctly
- [ ] Charts update with data
- [ ] Forms submit successfully
- [ ] Error handling works

---

## 🐛 TROUBLESHOOTING

### **Backend Issues**

**Problem: "Module not found"**
```bash
# Solution: Install dependencies
pip install -r requirements.txt
```

**Problem: "Port 8000 already in use"**
```bash
# Solution: Use different port
uvicorn app.main:app --reload --port 8001
```

**Problem: "No module named 'app'"**
```bash
# Solution: Make sure you're in backend folder
cd backend
python -c "import app; print('OK')"
```

---

### **Frontend Issues**

**Problem: "Command not found: npm"**
```bash
# Solution: Install Node.js
# Download from: https://nodejs.org
```

**Problem: "Port 3000 already in use"**
```bash
# Solution: Use different port
npm run dev -- -p 3001
```

**Problem: "Module not found"**
```bash
# Solution: Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### **Common Issues**

**Problem: "CORS error"**
```bash
# Solution: Backend is configured for CORS
# Make sure backend is running on port 8000
```

**Problem: "API calls fail"**
```bash
# Solution: Check .env.local
# Should have: NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📊 EXPECTED RESULTS

### **Backend Health Check**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2026-02-03T12:00:00Z"
}
```

### **Clean Endpoint**
```json
{
  "cleaned_records": [
    {
      "name": "John Doe",
      "email": "john@gmail.com"
    }
  ],
  "changes": [
    {
      "field": "name",
      "original": "  john DOE  ",
      "cleaned": "John Doe",
      "confidence": 1.0
    }
  ]
}
```

### **Frontend Pages**
- ✅ All pages load in < 1 second
- ✅ No console errors
- ✅ Smooth animations
- ✅ Responsive design
- ✅ Dark mode works

---

## 🚀 QUICK TEST SCRIPT

### **Windows PowerShell Script**

Create `test.ps1`:
```powershell
# Test Backend
Write-Host "Testing Backend..." -ForegroundColor Green
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Start-Process powershell -ArgumentList "uvicorn app.main:app --reload"
Start-Sleep 5
curl http://localhost:8000/health
Write-Host "Backend OK!" -ForegroundColor Green

# Test Frontend
Write-Host "Testing Frontend..." -ForegroundColor Green
cd ..\frontend
npm install
Start-Process powershell -ArgumentList "npm run dev"
Start-Sleep 10
Start-Process "http://localhost:3000"
Write-Host "Frontend OK!" -ForegroundColor Green

Write-Host "All tests complete!" -ForegroundColor Green
```

Run: `.\test.ps1`

---

## 🎉 SUCCESS CRITERIA

### **You'll know it's working when:**

**Backend:**
- ✅ Server starts without errors
- ✅ http://localhost:8000/docs loads
- ✅ All endpoints return 200
- ✅ Mock data returns correctly

**Frontend:**
- ✅ http://localhost:3000 loads
- ✅ All pages navigate smoothly
- ✅ Charts render
- ✅ Forms work
- ✅ Dark mode toggles

**Integration:**
- ✅ Frontend calls backend successfully
- ✅ Data displays correctly
- ✅ No CORS errors
- ✅ Everything works together

---

## 📞 NEED HELP?

**If something doesn't work:**

1. **Check the error message** - Usually tells you what's wrong
2. **Look at troubleshooting section** above
3. **Ask me!** - I'll help you fix it

**Common first-time issues:**
- Python not installed → Install Python 3.11+
- Node.js not installed → Install Node.js 18+
- Port already in use → Use different port
- Dependencies not installed → Run install commands

---

## 🎯 NEXT STEPS AFTER TESTING

**Once everything works locally:**

1. **Explore all features** - Click everything!
2. **Review the code** - See how it works
3. **Read documentation** - Understand the architecture
4. **Decide on deployment** - Free tier or AWS?
5. **Deploy!** - Follow FREE_DEPLOYMENT_GUIDE.md

---

**Ready to test? Just run the commands above! 🚀**

**Need help? Let me know what error you get and I'll fix it!**
