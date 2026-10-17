param(
  [ValidateRange(1, 65535)]
  [int]$Port = 1313
)

$ErrorActionPreference = "Stop"
$bindAddress = "127.0.0.1"
$requestedPort = $Port

function Test-TcpPortAvailable {
  param([int]$CandidatePort)

  $listener = [System.Net.Sockets.TcpListener]::new(
    [System.Net.IPAddress]::Parse($bindAddress),
    $CandidatePort
  )

  try {
    $listener.Start()
    return $true
  }
  catch [System.Net.Sockets.SocketException] {
    return $false
  }
  finally {
    $listener.Stop()
  }
}

while (-not (Test-TcpPortAvailable $Port)) {
  if ($Port -eq 65535) {
    throw "No available TCP port found at or above $requestedPort."
  }
  $Port++
}

if ($Port -ne $requestedPort) {
  Write-Warning "Port $requestedPort is already in use; using port $Port instead."
}

& hugo server `
  --source . `
  --themesDir themes `
  --theme termline `
  --bind $bindAddress `
  --port $Port `
  --baseURL "http://${bindAddress}:$Port/" `
  --renderToMemory `
  --noBuildLock

if ($LASTEXITCODE -ne 0) {
  throw "Hugo server exited with code $LASTEXITCODE."
}
