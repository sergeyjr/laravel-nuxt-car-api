@echo off
cd /d "%~dp0"

echo Docker container logs:
echo.
docker-compose logs -f --tail=50