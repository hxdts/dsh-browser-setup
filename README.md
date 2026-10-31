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

## 拖拽

原插件没有拖拽工具，本仓库通过 `browser_evaluate` 注入指针事件序列实现：

```javascript
// 在 browser_evaluate 里执行：从 (sx,sy) 拖到 (tx,ty)
(() => {
  const sx = 850, sy = 420, tx = 600, ty = 300;
  const start = document.elementFromPoint(sx, sy) || document.body;
  const o = (x, y, b) => ({ bubbles: true, cancelable: true, clientX: x, clientY: y, screenX: x, screenY: y, button: 0, buttons: b, pointerId: 1, pointerType: 'mouse', isPrimary: true, view: window });
  start.dispatchEvent(new PointerEvent('pointerdown', o(sx, sy, 1)));
  start.dispatchEvent(new MouseEvent('mousedown', o(sx, sy, 1)));
  for (let i = 1; i <= 20; i++) {
    const p = i / 20, x = sx + (tx - sx) * p, y = sy + (ty - sy) * p;
    document.dispatchEvent(new PointerEvent('pointermove', o(x, y, 1)));
    document.dispatchEvent(new MouseEvent('mousemove', o(x, y, 1)));
  }
  document.dispatchEvent(new PointerEvent('pointerup', o(tx, ty, 0)));
  document.dispatchEvent(new MouseEvent('mouseup', o(tx, ty, 0)));
  return 'dragged';
})()
```

适用于滑块、地图平移、可排序列表、Canvas 拖拽；实测在百度地图上拖动可正常平移。

注意：事件是合成的（`isTrusted=false`），极少数做了可信事件校验的站点可能不响应。

> 早期版本曾尝试注册 `browser_drag` 工具，但插件运行时的 `@deepseek-ai/dsh-tools` 解析依赖宿主内部路径，独立插件包加载失败，已回退为上面的 `browser_evaluate` 方案。

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
