@echo off
echo ========================================
echo   CLEARA BACKEND SERVER
echo ========================================
echo.

cd /d "%~dp0backend"

echo [1/3] Checking Python...
python --version
if errorlevel 1 (
    echo ERROR: Python not found! Please install Python 3.11+
    pause
    exit /b 1
)

echo.
echo [2/3] Installing dependencies...
pip install -r requirements.txt --quiet

echo.
echo [3/3] Starting backend server...
echo.
echo Backend will be available at: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

python -m uvicorn app.main:app --reload --port 8000
