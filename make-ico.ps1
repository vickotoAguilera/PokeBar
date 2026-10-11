Add-Type -AssemblyName System.Drawing
$pngPath = "$PSScriptRoot\src\icon.png"
$icoPath = "$PSScriptRoot\src\icon.ico"
$bmp = [System.Drawing.Bitmap]::FromFile($pngPath)
$resized = New-Object System.Drawing.Bitmap($bmp, 32, 32)
$iconHandle = $resized.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($iconHandle)
$stream = [System.IO.File]::Create($icoPath)
$icon.Save($stream)
$stream.Close()
$icon.Dispose()
$resized.Dispose()
$bmp.Dispose()
Write-Output "ICO created at $icoPath"
