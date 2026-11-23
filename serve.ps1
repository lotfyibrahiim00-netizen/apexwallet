param(
    [int]$Port = 8080,
    [string]$Root = "d:\wallet app"
)

$localIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254*" } | Select-Object -First 1).IPAddress

$listener = New-Object System.Net.Sockets.TcpListener ([System.Net.IPAddress]::Any, $Port)
$listener.Start()

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  APEXWALLET MOBILE SERVER ACTIVE" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "On your mobile phone (connected to same Wi-Fi):" -ForegroundColor Yellow
Write-Host "Open Chrome / Safari and go to:" -ForegroundColor White
Write-Host "   http://$($localIp):$Port" -ForegroundColor Green
Write-Host ""
Write-Host "On Android Chrome: Tap '⋮' -> 'Install App' or 'Add to Home Screen'!" -ForegroundColor Magenta
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Green

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $requestLine = $reader.ReadLine()

        if ($requestLine) {
            $tokens = $requestLine.Split(" ")
            $method = $tokens[0]
            $url = $tokens[1]

            if ($url -eq "/" -or $url -eq "") { $url = "/index.html" }
            $cleanUrl = $url.Split("?")[0].Split("#")[0]
            $filePath = Join-Path $Root ($cleanUrl.TrimStart('/'))

            if (Test-Path $filePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
                $bytes = [System.IO.File]::ReadAllBytes($filePath)

                $header = "HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)

                $stream.Write($headerBytes, 0, $headerBytes.Length)
                $stream.Write($bytes, 0, $bytes.Length)
            } else {
                $notFound = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: 9`r`nConnection: close`r`n`r`nNot Found"
                $notFoundBytes = [System.Text.Encoding]::ASCII.GetBytes($notFound)
                $stream.Write($notFoundBytes, 0, $notFoundBytes.Length)
            }
        }

        $stream.Flush()
        $stream.Close()
        $client.Close()
    }
} finally {
    $listener.Stop()
}
