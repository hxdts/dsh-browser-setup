import { defineTool } from "@deepseek-ai/dsh-tools";

const BRIDGE_URL = process.env.DSH_BROWSER_BRIDGE_URL || "http://127.0.0.1:9777/api/command";
const BRIDGE_TOKEN = process.env.DSH_BROWSER_BRIDGE_TOKEN || "dsh-local";

async function bridge(command, params) {
  const res = await fetch(BRIDGE_URL, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${BRIDGE_TOKEN}` },
    body: JSON.stringify({ command, params })
  });
  const json = await res.json().catch(() => ({}));
  if (!json.ok) {
    const msg = (json.error && (json.error.message || json.error)) || `bridge ${command} failed (HTTP ${res.status})`;
    throw new Error(String(msg));
  }
  return json.result;
}

function buildDragScript(a) {
  const payload = JSON.stringify({
    from: a.from || "",
    fromX: a.fromX,
    fromY: a.fromY,
    to: a.to || "",
    toX: a.toX,
    toY: a.toY,
    steps: a.steps
  });
  return `(() => {
    const A = ${payload};
    const center = (sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; };
    const s = A.from ? center(A.from) : { x: A.fromX, y: A.fromY };
    const t = A.to ? center(A.to) : { x: A.toX, y: A.toY };
    if (!s || !t || typeof s.x !== "number" || typeof t.x !== "number") return JSON.stringify({ ok: false, error: "from/to target not found" });
    const steps = Math.max(1, Math.floor(A.steps || 20));
    const opts = (x, y, buttons) => ({ bubbles: true, cancelable: true, clientX: x, clientY: y, screenX: x, screenY: y, button: 0, buttons, pointerId: 1, pointerType: "mouse", isPrimary: true, view: window });
    const start = document.elementFromPoint(s.x, s.y) || document.body;
    start.dispatchEvent(new PointerEvent("pointerdown", opts(s.x, s.y, 1)));
    start.dispatchEvent(new MouseEvent("mousedown", opts(s.x, s.y, 1)));
    for (let i = 1; i <= steps; i++) {
      const p = i / steps;
      const x = s.x + (t.x - s.x) * p;
      const y = s.y + (t.y - s.y) * p;
      document.dispatchEvent(new PointerEvent("pointermove", opts(x, y, 1)));
      document.dispatchEvent(new MouseEvent("mousemove", opts(x, y, 1)));
    }
    document.dispatchEvent(new PointerEvent("pointerup", opts(t.x, t.y, 0)));
    document.dispatchEvent(new MouseEvent("mouseup", opts(t.x, t.y, 0)));
    return JSON.stringify({ ok: true, from: s, to: t, steps });
  })()`;
}

export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: "browser_drag",
    description:
      "Drag from a start point to an end point with a pointer sequence (pointerdown/mousedown → N×mousemove → pointerup/mouseup). Use for sliders, maps, sortable lists and canvas drags. Give an element selector (center point) or explicit x/y coordinates; selector wins.",
    parameters: {
      from: { type: "string", description: "Start element CSS selector; its center is the start point. Optional when fromX/fromY are given." },
      fromX: { type: "number", description: "Start X in CSS px (used when from is empty)." },
      fromY: { type: "number", description: "Start Y in CSS px (used when from is empty)." },
      to: { type: "string", description: "End element CSS selector; its center is the end point. Optional when toX/toY are given." },
      toX: { type: "number", description: "End X in CSS px (used when to is empty)." },
      toY: { type: "number", description: "End Y in CSS px (used when to is empty)." },
      steps: { type: "number", description: "Number of intermediate moves (default 20)." },
      tabId: { type: "number", description: "Target tab; defaults to the active tab." }
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_args, value) => [{ type: "text", text: JSON.stringify(value) }]
    },
    presentCall: (args) => ({
      card: "generic",
      title: `Drag ${args.from || `${args.fromX},${args.fromY}`} → ${args.to || `${args.toX},${args.toY}`}`,
      kind: "other"
    }),
    async execute(args) {
      const params = { expression: buildDragScript(args) };
      if (args.tabId !== void 0) params.tabId = args.tabId;
      const result = await bridge("eval", params);
      const raw = result && result.value;
      let parsed;
      try { parsed = JSON.parse(raw); } catch { parsed = { ok: true, raw }; }
      if (parsed.ok === false) throw new Error(parsed.error || "drag failed");
      return parsed;
    }
  }));
}
