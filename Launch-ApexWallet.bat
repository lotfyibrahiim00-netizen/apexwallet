@echo off
title Launching ApexWallet...
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app="file:///d:/wallet app/index.html" --window-size=440,920
) else (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app="file:///d:/wallet app/index.html" --window-size=440,920
)
