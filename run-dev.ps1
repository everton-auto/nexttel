$ErrorActionPreference = 'Stop'

$localNode = Join-Path $PSScriptRoot '.tools\node'
$portableNode = Join-Path $env:LOCALAPPDATA 'Programs\nodejs'

if (Test-Path -LiteralPath $portableNode) {
  $env:Path = "$portableNode;$env:Path"
} elseif (Test-Path -LiteralPath $localNode) {
  $nodeDir = Get-ChildItem -LiteralPath $localNode -Directory |
    Where-Object { $_.Name -like 'node-v*-win-*' } |
    Sort-Object Name -Descending |
    Select-Object -First 1

  if ($nodeDir) {
    $env:Path = "$($nodeDir.FullName);$env:Path"
  }
}

npm run dev
