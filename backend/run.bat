@echo off
cd /d "%~dp0"
echo Compilando proyecto Maven...
if exist "%~dp0\.maven\apache-maven-3.9.5\bin\mvn.cmd" (
    echo Usando Maven local
    "%~dp0\.maven\apache-maven-3.9.5\bin\mvn.cmd" clean package -DskipTests
    if errorlevel 1 (
        echo Error en compilacion con Maven local
        pause
        exit /b 1
    )
) else (
    where mvn >nul 2>nul
    if %errorlevel%==0 (
        call mvn clean package -DskipTests
        if errorlevel 1 (
            echo Error en compilacion
            pause
            exit /b 1
        )
    ) else (
        echo Maven no encontrado. Ejecuta install-maven.ps1 o instala Maven en el sistema.
        pause
        exit /b 1
    )
)
echo.
echo Iniciando aplicacion...
java -jar target\wekapredictor-0.0.1-SNAPSHOT.jar
pause
