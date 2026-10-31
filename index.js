export const name = 'dsh-chrome-control-zh';

// 本包只提供 bundle 补丁（见 cordis.patch.yml），
// 真正的浏览器控制能力由依赖 @caob23/dsh-browser-control 提供。
// 拖拽能力通过 browser_evaluate 执行页面指针事件序列实现（见 USAGE.md）。
export function apply() {}
