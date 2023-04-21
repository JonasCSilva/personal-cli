$command = "Move-Item -Path .\pc.exe -Destination $env:OneDrive\bin\pc.exe -Force"

Write-Host $command`n -ForegroundColor Blue

Invoke-Expression $command