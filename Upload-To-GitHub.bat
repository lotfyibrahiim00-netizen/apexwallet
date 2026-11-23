@echo off
title Upload ApexWallet to GitHub & Vercel
color 0A
cd /d "d:\wallet app"

echo ======================================================================
echo           ApexWallet - Automatic GitHub & Vercel Publisher
echo ======================================================================
echo.
echo [1/3] Checking Git Status...
"C:\Program Files\Git\cmd\git.exe" status
echo.
echo [2/3] Authenticating with GitHub...
echo A browser window will open on GitHub.
echo Please confirm login / enter the verification code if prompted.
echo.
"C:\Program Files\GitHub CLI\gh.exe" auth login --web -h github.com -p https -w

if %errorlevel% neq 0 (
    echo.
    echo [!] GitHub authentication failed or was cancelled.
    echo If you prefer using a Personal Access Token or existing repo URL,
    echo run: git remote add origin ^<your-github-repo-url^>
    pause
    exit /b
)

echo.
echo [3/3] Creating repository and uploading to your GitHub...
"C:\Program Files\GitHub CLI\gh.exe" repo create apexwallet --public --source=. --remote=origin --push

echo.
echo ======================================================================
echo    SUCCESS! Your repository is now published on GitHub!
echo ======================================================================
echo.
echo Opening Vercel to complete 1-Click Deployment...
start https://vercel.com/new
echo.
echo On Vercel:
echo   1. Sign in with your GitHub account.
echo   2. Click "Import" next to 'apexwallet'.
echo   3. Click "Deploy" - You will get a live URL (e.g. apexwallet.vercel.app)!
echo.
pause
