@echo off
echo ========================================
echo CLEARA - Quick Test Script
echo ========================================
echo.

echo [1/3] Checking Python...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python not found!
    pause
    exit /b 1
)
echo ✓ Python OK
echo.

echo [2/3] Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    pause
    exit /b 1
)
echo ✓ Node.js OK
echo.

echo [3/3] Checking npm...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm not found!
    pause
    exit /b 1
)
echo ✓ npm OK
echo.

echo ========================================
echo ✓ All prerequisites installed!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Test Backend:
echo    cd backend
echo    python -m venv venv
echo    venv\Scripts\activate
echo    pip install -r requirements.txt
echo    uvicorn app.main:app --reload
echo.
echo 2. Test Frontend (in new terminal):
echo    cd frontend
echo    npm install
echo    npm run dev
echo.
echo 3. Open browser:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8000/docs
echo.
pause
