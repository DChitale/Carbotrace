@echo off
chcp 65001 >nul
title Carbotrace Fullstack Launcher
setlocal enabledelayedexpansion

:: ============================================================================
:: Carbotrace Fullstack Launcher (Backend + Frontend)
:: Verifies required ports (8001, 5173, 5432).
:: If in use, terminates blocking processes and restarts cleanly.
:: ============================================================================

cd /d "%~dp0"
set "PROJECT_ROOT=%~dp0"
if "%PROJECT_ROOT:~-1%"=="\" set "PROJECT_ROOT=%PROJECT_ROOT:~0,-1%"

echo.
echo ============================================================
echo         CARBOTRACE - One-Click Fullstack Launcher
echo ============================================================
echo.
echo [1/3] Checking Port Availability ^& Freeing Stale Services...

:: Free Port 8001 (FastAPI Backend)
call :free_port 8001

:: Free Port 5173 (Vite Frontend)
call :free_port 5173

echo.
echo [2/3] Verifying Database Container (PostgreSQL 5432)...
where docker >nul 2>&1
if !ERRORLEVEL! equ 0 (
    set "RUNNING_DB="
    for /f "tokens=*" %%i in ('docker ps -q -f "name=carbotrace-db"') do set "RUNNING_DB=%%i"
    if "!RUNNING_DB!"=="" (
        echo   [INFO] Starting database container (carbotrace-db)...
        docker start carbotrace-db >nul 2>&1
        if !ERRORLEVEL! equ 0 (
            echo   [OK] Database container (carbotrace-db) started successfully on port 5432!
        ) else (
            echo   [WARN] Could not auto-start 'carbotrace-db'. If PostgreSQL is not running, database features will be offline.
        )
    ) else (
        echo   [OK] PostgreSQL container (carbotrace-db) is active on port 5432.
    )
) else (
    echo   [INFO] Docker CLI not detected in PATH. Assuming native PostgreSQL or external database.
)

echo.
echo [3/3] Launching Backend and Frontend Services...
echo.

:: Launch Backend in separate window
echo   - Launching FastAPI Backend on port 8001...
start "Carbotrace Backend (FastAPI - Port 8001)" cmd /c "%PROJECT_ROOT%\run_backend.bat"

:: Delay to allow backend to bind and start up
timeout /t 3 /nobreak >nul

:: Launch Frontend in separate window
echo   - Launching Vite Frontend on port 5173...
cd /d "%PROJECT_ROOT%\frontend"
start "Carbotrace Frontend (Vite - Port 5173)" cmd /c "npm run dev"

echo.
echo ============================================================
echo   SUCCESS! Carbotrace services are launching:
echo.
echo   * Web App UI:     http://localhost:5173
echo   * Backend API:    http://localhost:8001/api
echo   * Swagger Docs:   http://localhost:8001/docs
echo   * Health Check:   http://localhost:8001/api/health
echo ============================================================
echo.
echo This launcher window will close automatically in 6 seconds.
timeout /t 6 >nul
exit /b 0

:: ----------------------------------------------------------------------------
:: Subroutine: Free a TCP port by terminating any listening PID
:: ----------------------------------------------------------------------------
:free_port
set "PORT_NUM=%~1"
set "PORT_FREED=0"
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":%PORT_NUM%" ^| findstr "LISTENING"') do (
    if not "%%p"=="" if not "%%p"=="0" if not "%%p"=="4" (
        echo   [PORT %PORT_NUM%] In use by PID %%p. Terminating existing process...
        taskkill /F /PID %%p >nul 2>&1
        set "PORT_FREED=1"
    )
)
if "!PORT_FREED!"=="1" (
    echo   [PORT %PORT_NUM%] Existing process terminated. Port %PORT_NUM% is now free.
    timeout /t 1 /nobreak >nul
) else (
    echo   [PORT %PORT_NUM%] Available (free).
)
exit /b 0
