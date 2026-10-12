# Carbotrace Backend Launcher for PowerShell
$ErrorActionPreference = "Continue"

$port = if ($args[0]) { $args[0] } else { 8001 }
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Free port if occupied
$connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if ($connections) {
    $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($procId in $pids) {
        if ($procId -gt 4) {
            $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
            $procName = if ($proc) { $proc.ProcessName } else { "PID $procId" }
            Write-Host "Port $port occupied by $procName (PID $procId). Terminating..." -ForegroundColor Yellow
            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
        }
    }
    Start-Sleep -Seconds 1
}

# Delegate to run_backend.bat
& "$scriptDir\run_backend.bat" $port
