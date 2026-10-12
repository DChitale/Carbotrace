# Carbotrace Fullstack Launcher for PowerShell
$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "        CARBOTRACE - One-Click Fullstack Launcher           " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Checking Port Availability & Terminating Stale Services..." -ForegroundColor Yellow

function Free-Port([int]$port) {
    $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($connections) {
        $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($procId in $pids) {
            if ($procId -gt 4) {
                $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
                $procName = if ($proc) { $proc.ProcessName } else { "PID $procId" }
                Write-Host "  [PORT $port] In use by $procName (PID $procId). Terminating..." -ForegroundColor Yellow
                Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
            }
        }
        Start-Sleep -Seconds 1
        Write-Host "  [PORT $port] Released successfully." -ForegroundColor Green
    } else {
        Write-Host "  [PORT $port] Available (free)." -ForegroundColor Green
    }
}

Free-Port 8001
Free-Port 5173

Write-Host ""
Write-Host "[2/3] Verifying Database Container (PostgreSQL 5432)..." -ForegroundColor Yellow
$dockerCmd = Get-Command docker -ErrorAction SilentlyContinue
if ($dockerCmd) {
    $runningDb = docker ps -q -f "name=carbotrace-db" 2>$null
    if (-not $runningDb) {
        Write-Host "  [INFO] Starting database container (carbotrace-db)..." -ForegroundColor Yellow
        docker start carbotrace-db 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [OK] Database container (carbotrace-db) started successfully on port 5432!" -ForegroundColor Green
        } else {
            Write-Host "  [WARN] Could not auto-start 'carbotrace-db'. Database features may be offline." -ForegroundColor DarkYellow
        }
    } else {
        Write-Host "  [OK] PostgreSQL container (carbotrace-db) is active on port 5432." -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "[3/3] Launching Backend and Frontend Services..." -ForegroundColor Yellow

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Launch backend in separate window
Write-Host "  - Launching FastAPI Backend on port 8001..." -ForegroundColor Cyan
Start-Process cmd.exe -ArgumentList "/c `"$scriptDir\run_backend.bat`""

Start-Sleep -Seconds 3

# Launch frontend in separate window
Write-Host "  - Launching Vite Frontend on port 5173..." -ForegroundColor Cyan
Start-Process cmd.exe -WorkingDirectory "$scriptDir\frontend" -ArgumentList "/c `"npm run dev`""

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  SUCCESS! Carbotrace services are launching:               " -ForegroundColor Green
Write-Host ""
Write-Host "  * Web App UI:     http://localhost:5173"
Write-Host "  * Backend API:    http://localhost:8001/api"
Write-Host "  * Swagger Docs:   http://localhost:8001/docs"
Write-Host "  * Health Check:   http://localhost:8001/api/health"
Write-Host "============================================================" -ForegroundColor Green
