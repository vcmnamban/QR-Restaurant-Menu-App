# GitHub Repository Setup Script
Write-Host "========================================" -ForegroundColor Green
Write-Host "   GitHub Repository Setup Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$githubUsername = Read-Host "Please enter your GitHub username"

Write-Host ""
Write-Host "Setting up remote origin for: $githubUsername" -ForegroundColor Yellow
Write-Host ""

# Add remote origin
& "C:\Program Files\Git\bin\git.exe" remote add origin "https://github.com/$githubUsername/qr-restaurant-menu-app.git"

Write-Host ""
Write-Host "Remote origin added successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Now pushing all branches to GitHub..." -ForegroundColor Yellow
Write-Host ""

# Push all branches
& "C:\Program Files\Git\bin\git.exe" push -u origin main
& "C:\Program Files\Git\bin\git.exe" push -u origin develop
& "C:\Program Files\Git\bin\git.exe" push -u origin phase1-backend-foundation

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "    Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your repository is now connected to GitHub!" -ForegroundColor Green
Write-Host "Check: https://github.com/$githubUsername/qr-restaurant-menu-app" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to continue"

