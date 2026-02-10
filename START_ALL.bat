@echo off
echo ============================================
echo   CLEARA - FULL STACK STARTUP
echo   Starting Backend + Frontend
echo ============================================
echo.

REM Get the directory where this script is located
set "ROOT_DIR=%~dp0"

echo [1/4] Starting Backend Server...
echo.
cd /d "%ROOT_DIR%backend"
start "Cleara Backend" cmd /k "echo Starting Backend on http://localhost:8000 && echo. && uvicorn app.main:app --reload"

timeout /t 3 /nobreak >nul

echo [2/4] Backend started on http://localhost:8000
echo.

echo [3/4] Starting Frontend Server...
echo.
cd /d "%ROOT_DIR%frontend"
start "Cleara Frontend" cmd /k "echo Starting Frontend on http://localhost:3000 && echo. && npm run dev"

timeout /t 3 /nobreak >nul

echo [4/4] Frontend starting on http://localhost:3000
echo.
echo ============================================
echo   CLEARA IS STARTING!
echo ============================================
echo.
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo Frontend: http://localhost:3000
echo Demo:     http://localhost:3000/demo
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
echo Press any key to exit this window...
pause >nul
