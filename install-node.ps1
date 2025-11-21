# Instala Node.js LTS localmente en el proyecto (carpeta .node) y ejecuta npm install
# Uso: Ejecutar desde la raíz del repo: .\install-node.ps1

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$destRoot = Join-Path $scriptRoot '.node'

if (Test-Path $destRoot) {
    Write-Host "Node ya instalado localmente en: $destRoot"
    # Ejecutar npm install con la instalación local
    $folder = Get-ChildItem $destRoot | Where-Object { $_.PSIsContainer } | Select-Object -First 1
    if ($null -eq $folder) { Write-Host "No se encontró la carpeta de Node en $destRoot"; exit 1 }
    $nodeDir = $folder.FullName
    $npmCmd = Join-Path $nodeDir 'npm.cmd'
    if (-not (Test-Path $npmCmd)) { Write-Host "npm no encontrado en $nodeDir"; exit 1 }
    Write-Host "Ejecutando: $npmCmd install"
    & $npmCmd install
    Write-Host "npm install finalizado"
    exit 0
}

Write-Host "Obteniendo la lista de versiones desde nodejs.org..."
$index = Invoke-RestMethod -Uri 'https://nodejs.org/dist/index.json' -ErrorAction Stop
$ltsEntry = $index | Where-Object { $_.lts -ne $null -and $_.lts -ne $false } | Select-Object -First 1
if ($null -eq $ltsEntry) { Write-Error "No se encontró versión LTS en index.json"; exit 1 }
$version = $ltsEntry.version # ejemplo: v18.20.1

$zipName = "node-$version-win-x64.zip"
$url = "https://nodejs.org/dist/$version/$zipName"
$zipPath = Join-Path $env:TEMP $zipName

Write-Host "Descargando Node $version desde: $url"
try {
    Invoke-WebRequest -Uri $url -OutFile $zipPath -UseBasicParsing -ErrorAction Stop
} catch {
    Write-Error "Error descargando $url : $($_.Exception.Message)"
    exit 1
}

Write-Host "Descomprimiendo $zipPath a $destRoot"
New-Item -ItemType Directory -Path $destRoot -Force | Out-Null
try {
    Expand-Archive -Path $zipPath -DestinationPath $destRoot -Force
} catch {
    Write-Error "Error descomprimiendo: $($_.Exception.Message)"
    exit 1
}

Remove-Item $zipPath -Force

$folder = Get-ChildItem $destRoot | Where-Object { $_.PSIsContainer } | Select-Object -First 1
if ($null -eq $folder) { Write-Error "No se encontró la carpeta extraída de Node"; exit 1 }
$nodeDir = $folder.FullName
$npmCmd = Join-Path $nodeDir 'npm.cmd'
if (-not (Test-Path $npmCmd)) { Write-Error "npm no encontrado en $nodeDir"; exit 1 }

Write-Host "Node instalado en: $nodeDir"
Write-Host "Ejecutando npm install en la raíz del proyecto..."
Set-Location $scriptRoot
& $npmCmd install
Write-Host "npm install finalizado"
