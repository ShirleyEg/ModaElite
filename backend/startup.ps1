#!/usr/bin/env pwsh

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Iniciador Spring Boot - Predictor Weka" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$backendPath = "C:\Users\Lenovo\Downloads\PredicciónVentasPrendas\backend"
$classesPath = "$backendPath\target\classes"

# Verificar si existen las clases compiladas
if (-not (Test-Path $classesPath)) {
    Write-Host "ERROR: Clases compiladas no encontradas en $classesPath" -ForegroundColor Red
    Write-Host "Por favor, compila el proyecto primero con: mvn clean compile" -ForegroundColor Yellow
    Read-Host "Presiona ENTER para salir"
    exit 1
}

Write-Host "Buscando dependencias JAR..." -ForegroundColor Yellow

# Intentar buscar el directorio .m2 de Maven donde están las dependencias
$m2Path = "$env:USERPROFILE\.m2\repository"
if (-not (Test-Path $m2Path)) {
    Write-Host "ERROR: Repositorio Maven no encontrado en $m2Path" -ForegroundColor Red
    Write-Host "Por favor, instala Maven y descarga las dependencias del proyecto." -ForegroundColor Yellow
    Write-Host "" -ForegroundColor Yellow
    Write-Host "Instrucciones:" -ForegroundColor Yellow
    Write-Host "1. Instala Maven desde https://maven.apache.org/download.cgi" -ForegroundColor Yellow
    Write-Host "2. Agregalo al PATH de Windows" -ForegroundColor Yellow
    Write-Host "3. Ejecuta: mvn clean compile" -ForegroundColor Yellow
    Read-Host "Presiona ENTER para salir"
    exit 1
}

Write-Host "Repositorio Maven encontrado" -ForegroundColor Green
Write-Host ""
Write-Host "Para ejecutar la aplicacion, necesitas:" -ForegroundColor Yellow
Write-Host "1. Instalar Maven" -ForegroundColor Yellow
Write-Host "2. Ejecutar: mvn clean package" -ForegroundColor Yellow
Write-Host "3. Luego ejecutar: java -jar target\wekapredictor-0.0.1-SNAPSHOT.jar" -ForegroundColor Yellow
Write-Host ""
Read-Host "Presiona ENTER para salir"
