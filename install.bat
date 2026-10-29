@echo off
chcp 65001 >nul
title DSH Browser Control 安装器
echo ============================================
echo   DSH Browser Control 一键安装
echo ============================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1"
echo.
echo 安装结束。按任意键关闭本窗口。
pause >nul
