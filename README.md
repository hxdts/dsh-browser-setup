# DSH Browser Control 一键安装器

让 **DeepSeek Harness（DSH）** 直接操控你日常使用的 **真实 Chrome**（保留登录态、Cookie、扩展），不需要再单独登录，也不需要无头浏览器。

本仓库只包含**安装脚本和使用说明**，不包含插件源码。插件本体是社区项目 [@caob23/dsh-browser-control](https://github.com/caob23/dsh-browser-control)，扩展来自它的 GitHub Release。

## 它能做什么

- 在你的真实 Chrome 里打开网页、点击、填表、滚动、截图
- 通过 Chrome 扩展桥接（WebSocket，本地 127.0.0.1:9777），不走远程调试端口
- 模型新建的标签会自动归入 **DSH 蓝色标签分组**，一眼看出哪些页面被控制
- 扩展弹窗有「锁定」按钮，一键冻结所有浏览器操作

## 前置条件

- Windows 10/11
- 已安装 DeepSeek Harness（桌面版或 web 版）
- 已安装 Google Chrome（116+）
- Node.js 22+（dsh 自带环境通常已满足）

## 安装

```powershell
# 在仓库根目录
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

如果你想安装到 web profile：

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -Profile web
```

脚本会做三件事：

1. `dsh plugin --profile desktop add @caob23/dsh-browser-control`（自动注册到 profile 的 bundles）
2. 从作者 Release 下载并解压 Chrome 扩展到 `~/.dsh/browser-control-extension`
3. 打印最后一步手动操作说明

## 最后一步（必须手动，浏览器安全限制）

1. Chrome 打开 `chrome://extensions`
2. 打开右上角「开发者模式」
3. 点「加载已解压的扩展程序」，选择 `%USERPROFILE%\.dsh\browser-control-extension`
4. 重启 DSH

工具栏出现鲸鱼图标、绿点呼吸 = 扩展已连接到桥。

## 验证

```powershell
# 桥状态（extensionConnected 应为 true）
Invoke-WebRequest http://127.0.0.1:9777/api/status -UseBasicParsing | Select-Object -Expand Content
```

在 DSH 对话里说「打开百度搜一下 xxx」，应能看到 Chrome 里自动操作。

## 日常使用建议

- 让 DSH 只操作**新建标签**，不接管你正在看的页面
- 需要自己用浏览器时，点扩展图标 →「锁定」
- 每次操作前注入虚拟光标是可选美化，见 [USAGE.md](USAGE.md)

## 许可与致谢

- 插件：[@caob23/dsh-browser-control](https://github.com/caob23/dsh-browser-control)，AGPL-3.0
- 扩展：同仓库 Release 产物
- 本仓库脚本：MIT

如果你要二次分发插件本体，请遵守 AGPL-3.0（保留许可证与署名，提供源码）。
