@echo off
title PDF Master Editor
color 0B

REM Always run relative to this batch file's directory
cd /d "%~dp0"

echo.
echo  ╔═══════════════════════════════════════╗
echo  ║      PDF MASTER EDITOR v1.0           ║
echo  ║   Full-Featured PDF Editing Suite     ║
echo  ╚═══════════════════════════════════════╝
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found! Install Python 3.9+ from https://python.org
    pause
    exit /b 1
)

REM Check Node
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found! Install from https://nodejs.org
    pause
    exit /b 1
)

REM Install backend deps
echo [1/4] Installing Python dependencies...
python -m pip install -r "%~dp0backend\requirements.txt" --quiet

REM Install frontend deps
echo [2/4] Installing Node dependencies...
cd /d "%~dp0frontend"
npm install --quiet
cd /d "%~dp0"

REM Start backend
echo [3/4] Starting Backend (FastAPI on port 8000)...
start "PDF Master Backend" cmd /c "cd /d "%~dp0backend" && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo [4/4] Starting Frontend (Vite on port 3000)...
start "PDF Master Frontend" cmd /c "cd /d "%~dp0frontend" && npm run dev"

REM Wait for frontend
timeout /t 3 /nobreak >nul

echo.
echo  OK PDF Master Editor is running!
echo  OK Open: http://localhost:3000
echo.
start "" "http://localhost:3000"
pause
