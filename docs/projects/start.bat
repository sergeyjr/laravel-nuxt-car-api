@echo off
cd /d "%~dp0"

echo Starting Docker containers...
docker-compose up -d

if %errorlevel% neq 0 (
    echo [ERROR] Failed to start!
    color 4
) else (
    echo [SUCCESS] Running!
    docker-compose ps
    color 2
)

pause