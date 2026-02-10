# 🎮 Starting and Stopping Cleara Servers

## 🚀 **How to Start**

### **Option 1: One-Click Start (Recommended)**
Double-click: `START_CLEARA.bat`

This opens 2 windows:
- Backend (Python)
- Frontend (Node.js)

### **Option 2: Manual Start**

**Terminal 1 - Backend:**
```powershell
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

---

## 🛑 **How to Stop**

### **If Using START_CLEARA.bat:**
1. Find the 2 terminal windows that opened
2. Click on each window
3. Press `Ctrl + C` in each

### **If Using Manual Start:**
In each terminal window, press: **`Ctrl + C`**

You'll see:
```
^C
Shutting down...
```

---

## 🔄 **How to Restart**

### **Full Restart:**
1. Stop both servers (`Ctrl + C`)
2. Start them again

### **Backend Only:**
```powershell
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

### **Frontend Only:**
```powershell
cd frontend
npm run dev
```

---

## ✅ **Verify They're Running**

### **Check Backend:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/health"
```

**Expected:**
```
status: healthy
service: Cleara API
```

### **Check Frontend:**
Open browser: http://localhost:3000

---

## 🔍 **Find Running Processes**

### **Check What's Running on Port 8000 (Backend):**
```powershell
Get-NetTCPConnection -LocalPort 8000 | Select-Object -Property LocalPort, OwningProcess
```

### **Check What's Running on Port 3000 (Frontend):**
```powershell
Get-NetTCPConnection -LocalPort 3000 | Select-Object -Property LocalPort, OwningProcess
```

### **Kill a Process by Port:**
```powershell
# Kill backend (port 8000)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess -Force

# Kill frontend (port 3000)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

---

## 📊 **Status Check**

| Server | Port | Health Check | Status Page |
|--------|------|--------------|-------------|
| **Backend** | 8000 | http://localhost:8000/health | http://localhost:8000/docs |
| **Frontend** | 3000 | http://localhost:3000 | http://localhost:3000 |

---

## 🎯 **Quick Commands**

### **Start Everything:**
```powershell
# Option 1: Double-click
START_CLEARA.bat

# Option 2: PowerShell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python -m uvicorn app.main:app --reload --port 8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
```

### **Stop Everything:**
```powershell
# Kill backend
Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess -Force

# Kill frontend
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

---

## 💡 **Tips**

1. **Always stop servers before closing terminals** - Use `Ctrl + C`, don't just close the window
2. **Check if ports are free** - Before starting, verify nothing is using ports 8000 or 3000
3. **Use the batch files** - They handle everything automatically
4. **Keep terminals visible** - So you can see errors and logs

---

## 🆘 **Common Issues**

### **"Port already in use"**
**Solution:** Kill the process using that port (see commands above)

### **"Cannot connect to backend"**
**Solution:** Make sure backend is running on port 8000

### **"Page not loading"**
**Solution:** Make sure frontend is running on port 3000

---

**Now you know how to control your Cleara servers!** 🎉
