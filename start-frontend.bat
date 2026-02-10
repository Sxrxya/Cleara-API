@echo off
echo ========================================
echo   CLEARA FRONTEND SERVER
echo ========================================
echo.

cd /d "%~dp0frontend"

echo [1/3] Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not found! Please install Node.js 18+
    pause
    exit /b 1
)

echo.
echo [2/3] Installing dependencies...
call npm install

echo.
echo [3/3] Starting frontend server...
echo.
echo Frontend will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
