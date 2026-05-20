@echo off
cd /d "%~dp0"

echo ======================================
echo  Full Rebuild (no cache)
echo ======================================
echo.

echo Stopping containers...
docker-compose down
echo.

echo Rebuilding WITHOUT cache...
docker-compose build --no-cache php
if %errorlevel% neq 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)
echo.

echo Starting containers...
docker-compose up -d

if %errorlevel% neq 0 (
    echo [ERROR] Failed to start!
) else (
    echo [SUCCESS] Rebuilt and running!
    docker-compose ps
)

pause