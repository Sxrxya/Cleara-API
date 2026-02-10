@echo off
echo ========================================
echo   CLEARA - COMPLETE STARTUP
echo ========================================
echo.
echo This will start both Backend and Frontend servers
echo in separate windows.
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to start...
pause > nul

echo.
echo Starting Backend Server...
start "Cleara Backend" cmd /k "%~dp0start-backend.bat"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Cleara Frontend" cmd /k "%~dp0start-frontend.bat"

echo.
echo ========================================
echo   CLEARA IS STARTING!
echo ========================================
echo.
echo Two new windows have opened:
echo   1. Backend Server (Python/FastAPI)
echo   2. Frontend Server (Next.js/React)
echo.
echo Wait for both to finish starting, then:
echo   - Open: http://localhost:3000
echo   - Login: demo@cleara.com / demo123
echo.
echo Close this window or press any key to exit.
pause > nul
