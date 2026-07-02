@echo off
setlocal

set "ROOT=%~dp0"

if not exist "%ROOT%frontend\package.json" (
  echo [ERROR] frontend/package.json not found.
  echo Make sure start_app.bat is placed in the project root folder.
  pause
  exit /b 1
)

if not exist "%ROOT%backend\package.json" (
  echo [ERROR] backend/package.json not found.
  echo Make sure start_app.bat is placed in the project root folder.
  pause
  exit /b 1
)

start "GSH Frontend" cmd /k "cd /d ""%ROOT%frontend"" && npm run dev"
start "GSH Backend" cmd /k "cd /d ""%ROOT%backend"" && npm run dev"

endlocal