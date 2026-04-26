# PowerShell UTF-8 Encoding Fix for PromptHub
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$env:LC_ALL = 'en_US.UTF-8'
$env:LANG = 'en_US.UTF-8'
Write-Host "✅ Terminal encoding set to UTF-8" -ForegroundColor Green
