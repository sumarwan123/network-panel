@echo off
REM NETWORK PANEL - Windows Startup Script
REM Usage: start.bat [dev|prod]

setlocal enabledelayedexpansion
set MODE=%1
if "%MODE%"=="" set MODE=dev

set COLOR_GREEN=
set COLOR_YELLOW=
set COLOR_BLUE=
set COLOR_NC=

echo.
echo ============================================
echo  NETWORK PANEL - Startup Script (Windows)
echo ============================================
echo.

REM Check Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js found: %NODE_VERSION%

REM Check .env file
if not exist .env (
    echo [WARNING] .env file not found. Creating from .env.example...
    copy .env.example .env
    echo [WARNING] Please edit .env file with your credentials
    pause
)

REM Create data directory
if not exist data mkdir data

if "%MODE%"=="dev" (
    echo.
    echo [INFO] Starting in DEVELOPMENT mode
    echo ============================================
    echo Backend:  http://localhost:5000
    echo Frontend: http://localhost:3000
    echo.
    echo Press Ctrl+C to stop
    echo.
    
    REM Install dependencies if needed
    if not exist node_modules (
        echo [INFO] Installing backend dependencies...
        call npm install
    )
    
    if not exist frontend\node_modules (
        echo [INFO] Installing frontend dependencies...
        cd frontend
        call npm install
        cd ..
    )
    
    echo [INFO] Starting backend...
    start "NETWORK PANEL Backend" cmd /k npm start
    
    timeout /t 3 /nobreak
    
    echo [INFO] Starting frontend...
    start "NETWORK PANEL Frontend" cmd /k "cd frontend && npm start"
    
    echo.
    echo [OK] Both servers started!
    echo [INFO] Open http://localhost:3000 in your browser
    echo.
    pause
    
) else if "%MODE%"=="prod" (
    echo.
    echo [INFO] Starting in PRODUCTION mode
    echo ============================================
    
    if not exist frontend\build (
        echo [INFO] Building frontend...
        cd frontend
        call npm run build
        cd ..
    )
    
    echo [OK] Starting production server on port 3000
    cmd /k "set NODE_ENV=production && node backend/server.js"
    
) else (
    echo Usage: start.bat [dev^|prod]
    pause
    exit /b 1
)
