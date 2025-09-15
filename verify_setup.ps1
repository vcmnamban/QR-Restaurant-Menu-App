# Backup System Verification Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Backup System Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Git installation
Write-Host "🔍 Checking Git Installation..." -ForegroundColor Yellow
try {
    $gitVersion = & "C:\Program Files\Git\bin\git.exe" --version
    Write-Host "✅ Git: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git not accessible" -ForegroundColor Red
    exit 1
}

# Check repository status
Write-Host ""
Write-Host "🔍 Checking Repository Status..." -ForegroundColor Yellow
$gitStatus = & "C:\Program Files\Git\bin\git.exe" status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  Working tree has uncommitted changes:" -ForegroundColor Yellow
    $gitStatus | ForEach-Object { Write-Host "   $_" -ForegroundColor Yellow }
} else {
    Write-Host "✅ Working tree is clean" -ForegroundColor Green
}

# Check current branch
Write-Host ""
Write-Host "🔍 Checking Current Branch..." -ForegroundColor Yellow
$currentBranch = & "C:\Program Files\Git\bin\git.exe" branch --show-current
Write-Host "✅ Current branch: $currentBranch" -ForegroundColor Green

# Check all branches
Write-Host ""
Write-Host "🔍 Checking All Branches..." -ForegroundColor Yellow
$branches = & "C:\Program Files\Git\bin\git.exe" branch -a
$branches | ForEach-Object { 
    if ($_ -match "\*") {
        Write-Host "   $_" -ForegroundColor Green
    } else {
        Write-Host "   $_" -ForegroundColor White
    }
}

# Check commit history
Write-Host ""
Write-Host "🔍 Checking Commit History..." -ForegroundColor Yellow
$commits = & "C:\Program Files\Git\bin\git.exe" log --oneline -5
Write-Host "✅ Last 5 commits:" -ForegroundColor Green
$commits | ForEach-Object { Write-Host "   $_" -ForegroundColor White }

# Check remote status
Write-Host ""
Write-Host "🔍 Checking Remote Status..." -ForegroundColor Yellow
$remotes = & "C:\Program Files\Git\bin\git.exe" remote -v
if ($remotes) {
    Write-Host "✅ Remote repositories configured:" -ForegroundColor Green
    $remotes | ForEach-Object { Write-Host "   $_" -ForegroundColor White }
} else {
    Write-Host "⚠️  No remote repositories configured" -ForegroundColor Yellow
    Write-Host "   Run setup_github.ps1 to connect to GitHub" -ForegroundColor Cyan
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($currentBranch -eq "phase1-backend-foundation") {
    Write-Host "✅ Branch Status: Correct development branch" -ForegroundColor Green
} else {
    Write-Host "⚠️  Branch Status: Should be on phase1-backend-foundation" -ForegroundColor Yellow
}

if (-not $gitStatus) {
    Write-Host "✅ Working Tree: Clean and ready for development" -ForegroundColor Green
} else {
    Write-Host "⚠️  Working Tree: Has uncommitted changes" -ForegroundColor Yellow
}

if ($remotes) {
    Write-Host "✅ Remote: Connected to GitHub" -ForegroundColor Green
} else {
    Write-Host "⚠️  Remote: Not connected - run setup script" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
if (-not $remotes) {
    Write-Host "   1. Create GitHub repository" -ForegroundColor White
    Write-Host "   2. Run setup_github.ps1" -ForegroundColor White
    Write-Host "   3. Start Phase 1 development" -ForegroundColor White
} else {
    Write-Host "   1. Start Phase 1 development" -ForegroundColor White
    Write-Host "   2. Use daily workflow for backup" -ForegroundColor White
}

Write-Host ""
Read-Host "Press Enter to continue"

