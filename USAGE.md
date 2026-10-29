# 使用说明（含虚拟光标）

## 基本用法

在 DSH 里直接说人话即可：

- 「打开百度搜一下今天的天气」
- 「打开这个链接，把表单填了」
- 「去 B 站搜 xxx，打开第一个视频」

Agent 会在新建标签里操作，你可以在自己的 Chrome 里看到整个过程。

## 可控性

- **只操作新标签**：默认不接管你正在看的页面
- **锁定**：Chrome 工具栏鲸鱼图标 → 「锁定」，立即冻结所有浏览器操作，只有你能解锁
- **标签分组**：Agent 新建的标签自动进入 `DSH` 蓝色分组，便于识别和清理

## 虚拟光标（可选）

插件本身不带指针动画。如果希望每一步都能看到「光标移动 + 点击水波纹」，可以在每次点击/输入前注入一个光标层：

```js
// 在 browser_evaluate 里执行
const id = '__dsh_cursor__';
let c = document.getElementById(id);
if (!c) {
  c = document.createElement('div');
  c.id = id;
  c.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;width:28px;height:28px;opacity:0;transform:translate(1240px,720px);transition:transform .55s cubic-bezier(.22,.61,.36,1),opacity .2s';
  c.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,.45))"><path d="M5 3L19 12L13 13.5L16.5 19L14 20.5L10.5 15L5 18V3Z" fill="#fff" stroke="#111" stroke-width="1.4"/></svg>';
  document.documentElement.appendChild(c);
}
const e = document.querySelector('目标选择器');
const r = e.getBoundingClientRect();
const x = r.x + r.width / 2, y = r.y + r.height / 2;
c.style.opacity = '1';
c.style.transform = `translate(${x - 6}px,${y - 4}px)`;
// 等 700ms 后再执行真实点击，避免指针还在路上时点击已发生
```

要点：

1. **先注入、等动画走完（≥700ms）、再点击**，否则会出现「点击位置和指针位置不同步」的错觉
2. 点击后用返回的 `clicked.x/y` 和光标坐标核对，偏差超过 2px 时重新注入再点
3. 页面 CSP 或跨域 iframe 会阻止注入，此时如实说明「本次无可视光标」即可

## 常见问题

| 现象 | 处理 |
|---|---|
| `no browser extension connected` | Chrome 没开或扩展未启用；打开 Chrome，点鲸鱼图标确认绿点 |
| 扩展显示未连接 | 确认 DSH 在运行（桥 9777），在 `chrome://extensions` 里刷新扩展 |
| 点击后页面没反应 | 元素可能被遮挡或在 iframe 里；改用 `browser_snapshot` 的 ref 重试 |
| 想临时自己用浏览器 | 扩展弹窗「锁定」 |
