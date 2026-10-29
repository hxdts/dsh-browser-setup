#requires -Version 5.1
<#
  DSH Browser Control 一键安装器
  ---------------------------------
  为 DeepSeek Harness 安装「真实 Chrome」浏览器控制：
    - dsh 插件：@caob23/dsh-browser-control（npm 安装）
    - Chrome 扩展：DSH Browser Control（从作者 GitHub Release 下载并解压）

  用法：
    .\install.ps1                 # 安装到 desktop profile
    .\install.ps1 -Profile web    # 安装到 web profile

  注意：本脚本不修改浏览器设置，扩展需要用户在 chrome://extensions
  里手动「加载已解压的扩展程序」（Chrome 的安全限制，无法自动化）。
#>
param(
  [string]$Profile = "desktop",
  [string]$Version = "1.0.19"
)

$ErrorActionPreference = "Stop"
$plugin = "@caob23/dsh-browser-control"
$extDir = Join-Path $env:USERPROFILE ".dsh\browser-control-extension"
$zip = Join-Path $env:TEMP "dsh-browser-control-$Version.zip"

function Write-Section($text) { Write-Host ""; Write-Host "== $text ==" -ForegroundColor Cyan }

Write-Section "1/3 安装 dsh 插件"
$dsh = Get-Command dsh -ErrorAction SilentlyContinue
if (-not $dsh) {
  $candidate = "C:\Users\$env:USERNAME\AppData\Local\Programs\DeepSeek Harness\resources\runtime\cli\bin\dsh.cmd"
  if (Test-Path $candidate) { $dsh = $candidate } else { throw "找不到 dsh 命令。请先安装 DeepSeek Harness，或把 dsh 加入 PATH。" }
}
& $dsh plugin --profile $Profile add $plugin
if ($LASTEXITCODE -ne 0) { throw "插件安装失败（dsh plugin add 返回 $LASTEXITCODE）。" }

Write-Section "2/3 下载并解压 Chrome 扩展"
$urls = @(
  "https://ghproxy.net/https://github.com/caob23/dsh-browser-control/releases/download/v$Version/DSH-Browser-Control-v$Version.zip",
  "https://github.com/caob23/dsh-browser-control/releases/download/v$Version/DSH-Browser-Control-v$Version.zip"
)
$ok = $false
foreach ($u in $urls) {
  try {
    Write-Host "下载: $u"
    Invoke-WebRequest -Uri $u -OutFile $zip -TimeoutSec 120
    $ok = $true
    break
  } catch { Write-Host "  失败: $($_.Exception.Message)" -ForegroundColor Yellow }
}
if (-not $ok) { throw "扩展下载失败，请手动从 https://github.com/caob23/dsh-browser-control/releases 下载 v$Version 的 zip。" }

if (Test-Path $extDir) { Remove-Item $extDir -Recurse -Force }
Expand-Archive -Path $zip -DestinationPath $extDir -Force
if (-not (Test-Path (Join-Path $extDir "manifest.json"))) { throw "解压后未找到 manifest.json，压缩包结构可能已变化。" }
Write-Host "扩展已解压到: $extDir"

Write-Section "3/3 完成，还差一步（浏览器安全限制）"
Write-Host "请在 Chrome 中手动加载扩展：" -ForegroundColor Green
Write-Host "  1. 打开 chrome://extensions"
Write-Host "  2. 打开右上角「开发者模式」"
Write-Host "  3. 点「加载已解压的扩展程序」，选择：$extDir"
Write-Host ""
Write-Host "加载后：工具栏出现鲸鱼图标、绿点呼吸 = 已连接。"
Write-Host "然后重启一次 DSH，让 browser_* 工具注册。"
Write-Host ""
Write-Host "验证桥状态: http://127.0.0.1:9777/api/status （extensionConnected 应为 true）"

# 自动打开扩展页并把扩展路径放进剪贴板，少点几下
Set-Clipboard -Value $extDir
$chrome = @(
  "C:\Program Files\Google\Chrome\Application\chrome.exe",
  "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if ($chrome) {
  Start-Process $chrome -ArgumentList "chrome://extensions"
  Write-Host "已打开 chrome://extensions，扩展路径已复制到剪贴板（直接 Ctrl+V）。" -ForegroundColor Cyan
} else {
  Write-Host "未找到 Chrome，请手动打开 chrome://extensions。" -ForegroundColor Yellow
}
