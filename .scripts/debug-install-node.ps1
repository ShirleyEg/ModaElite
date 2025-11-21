$ver='v24.11.1'
$zip = Join-Path $env:TEMP "node-$ver-win-x64.zip"
Write-Host "Descargando $ver"
Invoke-WebRequest -Uri "https://nodejs.org/dist/$ver/node-$ver-win-x64.zip" -OutFile $zip -UseBasicParsing -ErrorAction Stop
Write-Host "ZIP: $zip"
Get-Item $zip | Format-List Name,Length
if (Test-Path .node) { Remove-Item .node -Recurse -Force }
New-Item -ItemType Directory -Path .node | Out-Null
Expand-Archive -Path $zip -DestinationPath .node -Force -Verbose
Write-Host "Contenido extraido (primeros 80):"
Get-ChildItem .node -Recurse -Force | Select-Object FullName -First 80 | ForEach-Object { Write-Host $_.FullName }
$nodeDir = Join-Path (Get-Location) ".node\node-v24.11.1-win-x64"
$npmCmd = Join-Path $nodeDir "npm.cmd"
if (Test-Path $npmCmd) {
	Write-Host "Ejecutando npm install con:" $npmCmd
	& $npmCmd install --no-audit --no-fund
} else {
	Write-Host "npm.cmd no encontrado en:" $npmCmd
}
