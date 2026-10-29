# DSH Chrome 控制（控制你的 Google Chrome）一键安装器

让 **DeepSeek Harness（DSH）** 直接操控你日常使用的 **真实 Chrome**（保留登录态、Cookie、扩展），不用重新登录，也不用无头浏览器。

本仓库只包含**安装脚本**，不包含插件源码。插件本体是社区项目 [@caob23/dsh-browser-control](https://github.com/caob23/dsh-browser-control)，扩展来自它的 GitHub Release。

## 安装（就 3 步）

1. **双击 `install.bat`**（会自动装插件、下载扩展、打开 Chrome 扩展页，并把扩展路径放进剪贴板）
2. 在打开的 `chrome://extensions` 页面：
   - 打开右上角「**开发者模式**」
   - 点「**加载已解压的扩展程序**」
   - 在弹出的地址栏按 `Ctrl+V`（路径已复制好），回车
3. **重启一次 DSH**，完成

> 为什么第 2 步必须手动？Chrome 从 136 版起禁止程序自动加载未上架的扩展，这是浏览器的安全限制，任何工具都绕不开。但只点两下，之后一劳永逸。

## 验证

Chrome 工具栏出现鲸鱼图标、绿点呼吸 = 已连接。

或在 PowerShell 里：

```powershell
Invoke-WebRequest http://127.0.0.1:9777/api/status -UseBasicParsing | Select-Object -Expand Content
```

`extensionConnected` 为 `true` 即成功。

## 日常使用

装好后在 DSH 里直接说人话：

- 「打开百度搜一下今天的天气」
- 「打开这个链接，把表单填了」

Agent 会在新建标签里操作，你可以在自己的 Chrome 里看着。

- **只操作新标签**，不抢你正在看的页面
- 新建标签自动进 `DSH` 蓝色分组
- 想自己用浏览器：点鲸鱼图标 →「锁定」，一键冻结

无法按预期运行时，先看 [USAGE.md](USAGE.md) 的常见问题。

## 许可与致谢

- 插件：[@caob23/dsh-browser-control](https://github.com/caob23/dsh-browser-control)，AGPL-3.0
- 扩展：同仓库 Release 产物
- 本仓库脚本：MIT

二次分发插件本体请遵守 AGPL-3.0（保留许可证与署名、提供源码）。
