# DSH Chrome 控制（控制你的 Google Chrome）一键安装器

让 **DeepSeek Harness（DSH）** 直接操控你日常使用的 **真实 Google Chrome**：保留登录态、Cookie、扩展，不用重新登录，也不用无头浏览器。

本仓库既是 **可安装的 DSH 插件包**（`dsh-chrome-control-zh`，中文包装层，依赖并加载社区插件 [@caob23/dsh-browser-control](https://github.com/caob23/dsh-browser-control)），也附带一个 **Windows 双击安装器**。

## 方式 A：作为插件安装（推荐，可被插件市场收录）

```bash
dsh plugin add github:hxdts/dsh-browser-setup
```

或：

```bash
dsh plugin --profile desktop add github:hxdts/dsh-browser-setup
```

装完重启 DSH，然后加载 Chrome 扩展（只需一次）：

1. 打开 `chrome://extensions`
2. 打开右上角「开发者模式」
3. 点「加载已解压的扩展程序」，选择 `%USERPROFILE%\.dsh\browser-control-extension`
   （如果目录不存在，扩展包在 `node_modules/@caob23/dsh-browser-control` 仓库里没有附扩展，请用方式 B 的脚本下载，或从作者 Release 下载后解压到该目录）

## 方式 B：双击安装器（Windows，全自动）

1. 下载本仓库 ZIP 并解压
2. **双击 `install.bat`**：自动装插件、下载并解压 Chrome 扩展、打开扩展页、把扩展路径放进剪贴板
3. 浏览器里点两下：开发者模式 → 加载已解压的扩展程序 → `Ctrl+V` → 回车
4. 重启 DSH

> 为什么扩展必须手动加载？Chrome 136 起禁止程序自动加载未上架扩展，这是浏览器的安全限制，无法绕过。

## 验证

Chrome 工具栏出现鲸鱼图标、绿点呼吸 = 已连接。

```powershell
Invoke-WebRequest http://127.0.0.1:9777/api/status -UseBasicParsing | Select-Object -Expand Content
```

`extensionConnected` 为 `true` 即成功。

## 日常使用

在 DSH 里直接说人话：

- 「打开百度搜一下今天的天气」
- 「打开这个链接，把表单填了」

Agent 会在新建标签里操作，你可以在自己的 Chrome 里看着。

- **只操作新标签**，不抢你正在看的页面
- 新建标签自动进 `DSH` 蓝色分组
- 想自己用浏览器：点鲸鱼图标 →「锁定」，一键冻结

无法按预期运行时，先看 [USAGE.md](USAGE.md)。

## 组件

| 文件 | 作用 |
|---|---|
| `package.json` / `cordis.patch.yml` / `index.js` | DSH 插件包，加载 `@caob23/dsh-browser-control` |
| `install.ps1` / `install.bat` | Windows 双击安装器 |
| `USAGE.md` | 用法与排错 |

## 许可与致谢

- 插件能力：[caob23/dsh-browser-control](https://github.com/caob23/dsh-browser-control)，AGPL-3.0
- 扩展：同仓库 Release 产物
- 本仓库包装层与脚本：MIT

二次分发插件本体请遵守 AGPL-3.0（保留许可证与署名、提供源码）。
