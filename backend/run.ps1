#!/usr/bin/env pwsh

$backendPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $backendPath

Write-Host "Compilando proyecto Maven..." -ForegroundColor Green

# Intentar compilar con Maven (local .maven o sistema)
$localMavenDir = Join-Path $PSScriptRoot ".maven\apache-maven-3.9.5\bin"
$localMvn = Join-Path $localMavenDir "mvn.cmd"

if (Test-Path $localMvn) {
    Write-Host "Usando Maven local: $localMvn" -ForegroundColor Green
    & $localMvn clean package -DskipTests
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error en compilacion con Maven local" -ForegroundColor Red
        Read-Host "Presiona ENTER para salir"
        exit 1
    }
} elseif (Get-Command mvn -ErrorAction SilentlyContinue) {
    Write-Host "Usando Maven del sistema" -ForegroundColor Green
    mvn clean package -DskipTests
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error en compilacion" -ForegroundColor Red
        Read-Host "Presiona ENTER para salir"
        exit 1
    }
} else {
    Write-Host "Maven no encontrado. Puedes instalarlo con .\\install-maven.ps1" -ForegroundColor Yellow
    Write-Host "O instala Maven en el sistema y vuelve a ejecutar este script." -ForegroundColor Yellow
    Read-Host "Presiona ENTER para salir"
    exit 1
}

Write-Host ""
Write-Host "Iniciando aplicacion..." -ForegroundColor Green

# Ejecutar la aplicación
if (Test-Path "target\wekapredictor-0.0.1-SNAPSHOT.jar") {
    java -jar target\wekapredictor-0.0.1-SNAPSHOT.jar
} else {
    Write-Host "JAR no encontrado. Verifica que la compilacion fue exitosa." -ForegroundColor Red
    Read-Host "Presiona ENTER para salir"
}
