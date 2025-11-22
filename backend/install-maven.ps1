# Instala Maven localmente en el proyecto (carpeta .maven) sin requerir privilegios
# Uso: Ejecutar desde PowerShell en la carpeta backend:
#   .\install-maven.ps1

param(
    [string]$MavenVersion = '3.9.5'
)

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$destRoot = Join-Path $scriptRoot '.maven'
$destDir = Join-Path $destRoot "apache-maven-$MavenVersion"

if (Test-Path $destDir) {
    Write-Host "Maven $MavenVersion ya instalado en: $destDir" -ForegroundColor Green
    exit 0
}

    $zipName = "apache-maven-$MavenVersion-bin.zip"
    $zipPath = Join-Path $env:TEMP $zipName

    # Intentar varios mirrors conocidos hasta encontrar uno que funcione
    $baseUrls = @(
        'https://downloads.apache.org/maven/maven-3',
        'https://dlcdn.apache.org/maven/maven-3',
        'https://archive.apache.org/dist/maven/maven-3'
    )

    $downloaded = $false
    foreach ($base in $baseUrls) {
        $url = "$base/$MavenVersion/binaries/$zipName"
        Write-Host "Intentando descargar Maven $MavenVersion desde: $url" -ForegroundColor Cyan
        try {
            Invoke-WebRequest -Uri $url -OutFile $zipPath -UseBasicParsing -ErrorAction Stop
            $downloaded = $true
            break
        } catch {
            Write-Host ("Fallo descarga desde {0}: {1}" -f $base, $_.Exception.Message) -ForegroundColor Yellow
        }
    }

    if (-not $downloaded) {
        Write-Host "No se pudo descargar Maven desde los mirrors probados." -ForegroundColor Red
        exit 1
    }

# Crear carpeta destino
New-Item -ItemType Directory -Path $destRoot -Force | Out-Null

Write-Host "Descomprimiendo $zipPath a $destRoot" -ForegroundColor Cyan
try {
    Expand-Archive -Path $zipPath -DestinationPath $destRoot -Force
} catch {
    Write-Host "Fallo descompresión: $_" -ForegroundColor Red
    exit 1
}

Remove-Item $zipPath -Force

$mvncmd = Join-Path $destDir 'bin\mvn.cmd'
if (Test-Path $mvncmd) {
    Write-Host "Maven instalado correctamente en: $destDir" -ForegroundColor Green
    Write-Host "Para usarlo temporalmente en esta sesión:"
    Write-Host ("  `$env:Path = '{0}\\bin;' + `$env:Path" -f $destDir)
    Write-Host "O ejecuta el script de arranque: .\\run.ps1" -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "No se encontró el ejecutable mvn.cmd después de la instalación" -ForegroundColor Red
    exit 1
}
