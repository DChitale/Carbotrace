@echo off
chcp 65001 >nul
title Carbotrace Backend Service (FastAPI)

:: ============================================================================
:: Carbotrace Backend Launcher
:: Runs FastAPI with Uvicorn on localhost
:: ============================================================================

setlocal enabledelayedexpansion

:: Navigate to project root directory
cd /d "%~dp0"
set "PROJECT_ROOT=%~dp0"
if "%PROJECT_ROOT:~-1%"=="\" set "PROJECT_ROOT=%PROJECT_ROOT:~0,-1%"

:: Check for help flags
if "%~1"=="--help" goto :show_help
if "%~1"=="-h" goto :show_help
if "%~1"=="/?" goto :show_help

:: Resolve Port: Check command argument, or default to 8001 (matching frontend/.env)
set "PORT=8001"
if not "%~1"=="" (
    set "PORT=%~1"
)
goto :proceed

:show_help
echo.
echo Usage: run_backend.bat [port]
echo Example: run_backend.bat 8001
echo Default port is 8001 (matching frontend/.env)
echo.
pause
exit /b 0

:proceed

:: Locate Python Virtual Environment
set "PYTHON_BIN="

if exist "%PROJECT_ROOT%\backend\.venv\Scripts\python.exe" (
    set "PYTHON_BIN=%PROJECT_ROOT%\backend\.venv\Scripts\python.exe"
) else if exist "%PROJECT_ROOT%\.venv\Scripts\python.exe" (
    set "PYTHON_BIN=%PROJECT_ROOT%\.venv\Scripts\python.exe"
) else (
    where python >nul 2>&1
    if !ERRORLEVEL! equ 0 (
        set "PYTHON_BIN=python"
    )
)

if "!PYTHON_BIN!"=="" (
    echo.
    echo ============================================================
    echo  [ERROR] Python or Virtual Environment not found!
    echo ============================================================
    echo  Looked for:
    echo    - backend\.venv\Scripts\python.exe
    echo    - .venv\Scripts\python.exe
    echo    - System PATH python
    echo.
    echo  Please initialize the backend environment first:
    echo    cd backend
    echo    python -m venv .venv
    echo    .\.venv\Scripts\activate
    echo    pip install -r requirements.txt
    echo ============================================================
    echo.
    pause
    exit /b 1
)

:: Set PYTHONPATH to project root so backend.app modules resolve cleanly
set "PYTHONPATH=%PROJECT_ROOT%"

echo.
echo ============================================================
echo         CARBOTRACE - Carbon Analytics Backend Engine
echo ============================================================
echo   [OK] Project Root:     %PROJECT_ROOT%
echo   [OK] Python:           %PYTHON_BIN%
echo   [OK] Service Port:     %PORT%
:: Ensure Database (carbotrace-db) is running if Docker is available
:: Ensure Database (carbotrace-db) is running if Docker is available
where docker >nul 2>&1
if !ERRORLEVEL! equ 0 (
    docker info >nul 2>&1
    if !ERRORLEVEL! equ 0 (
        set "RUNNING_DB="
        for /f "tokens=*" %%i in ('docker ps -q -f "name=carbotrace-db" 2^>nul') do set "RUNNING_DB=%%i"
        if "!RUNNING_DB!"=="" (
            echo   [INFO] Checking database container (carbotrace-db)...
            docker start carbotrace-db >nul 2>&1
            if !ERRORLEVEL! equ 0 (
                echo   [OK] Started PostgreSQL container (carbotrace-db) on port 5432!
            ) else (
                echo   [WARN] Could not auto-start carbotrace-db container.
            )
        ) else (
            echo   [OK] PostgreSQL container (carbotrace-db) is active on port 5432.
        )
    ) else (
        echo   [WARN] Docker found but not running. Skipping DB container check.
    )
)

echo.
echo   * API Endpoint:        http://localhost:%PORT%/api
echo   * Interactive Docs:    http://localhost:%PORT%/docs
echo   * Health Check:        http://localhost:%PORT%/api/health
echo.
echo   Press [Ctrl+C] anytime to stop the backend server.
echo ============================================================
echo.

:: Ensure target service port is free
set "PORT_FREED=0"
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":%PORT%" ^| findstr "LISTENING"') do (
    if not "%%p"=="" if not "%%p"=="0" if not "%%p"=="4" (
        echo   [INFO] Port %PORT% is occupied by PID %%p. Terminating existing process...
        taskkill /F /PID %%p >nul 2>&1
        set "PORT_FREED=1"
    )
)
if "!PORT_FREED!"=="1" (
    echo   [OK] Stale process on port %PORT% terminated. Port is now free.
    timeout /t 1 /nobreak >nul
)

:: Launch FastAPI server using Uvicorn (restricted to watching backend/app to prevent reload loops when cloning repos)
"!PYTHON_BIN!" -m uvicorn backend.app.main:app --reload --reload-dir backend/app --host 0.0.0.0 --port %PORT%

:: Keep terminal window open if server stops or errors out
echo.
echo ============================================================
echo  Carbotrace Backend stopped.
echo ============================================================
pause
