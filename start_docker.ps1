# Script para iniciar Finance Tracker con Docker
$scriptPath = $PSScriptRoot
Set-Location $scriptPath
Write-Host "Iniciando Finance Tracker en: $scriptPath"
Write-Host "Ejecutando docker-compose up..."
& docker-compose up -d
Write-Host "Servicios iniciados. Esperando a que estén listos..."
Start-Sleep -Seconds 5
Write-Host "Finance Tracker debe estar disponible en:"
Write-Host "Frontend: http://localhost:3000"
Write-Host "Backend: http://localhost:8000"
Write-Host "Base de datos: localhost:5432"
