@echo off
echo ============================================
echo   CLEARA - AI-POWERED DATA CLEANING
echo   Starting Backend Server...
echo ============================================
echo.

cd /d "%~dp0backend"

echo [1/2] Checking environment...
if not exist .env (
    echo ERROR: .env file not found!
    echo Please make sure .env file exists with your API keys.
    pause
    exit /b 1
)

echo [2/2] Starting server...
echo.
echo Backend will start on: http://localhost:8000
echo API Docs available at: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

uvicorn app.main:app --reload

pause
