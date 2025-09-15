@echo off
echo ========================================
echo    GitHub Repository Setup Script
echo ========================================
echo.

echo Please enter your GitHub username:
set /p GITHUB_USERNAME=

echo.
echo Setting up remote origin for: %GITHUB_USERNAME%
echo.

"C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/%GITHUB_USERNAME%/qr-restaurant-menu-app.git

echo.
echo Remote origin added successfully!
echo.
echo Now pushing all branches to GitHub...
echo.

"C:\Program Files\Git\bin\git.exe" push -u origin main
"C:\Program Files\Git\bin\git.exe" push -u origin develop
"C:\Program Files\Git\bin\git.exe" push -u origin phase1-backend-foundation

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Your repository is now connected to GitHub!
echo Check: https://github.com/%GITHUB_USERNAME%/qr-restaurant-menu-app
echo.
pause

