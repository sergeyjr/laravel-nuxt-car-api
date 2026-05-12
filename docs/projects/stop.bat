@echo off
cd /d "%~dp0"

echo Stopping Docker containers...
docker-compose down

if %errorlevel% neq 0 (
    echo [ERROR] Failed to stop!
) else (
    echo [SUCCESS] Containers stopped!
)

pause