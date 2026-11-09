import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

/**
 * A small agent-graph: drifting nodes that connect to their neighbours and to the pointer.
 * Draws one still frame (no loop) when the visitor prefers reduced motion, and pauses off-screen.
 */
export function NeuralField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const host = canvas.parentElement as HTMLElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    let accent = "139,123,255";
    let accent2 = "45,212,170";
    let running = false;
    let frame = 0;

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      accent = cs.getPropertyValue("--accent-rgb").trim() || accent;
      accent2 = cs.getPropertyValue("--accent2-rgb").trim() || accent2;
    };

    const resize = () => {
      const r = host.getBoundingClientRect();
      w = r.width;
      h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(24, Math.min(70, Math.round((w * h) / 17000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: 1 + Math.random() * 1.6,
      }));
      draw();
    };

    const LINK = 130;
    const POINTER_LINK = 190;

    function step() {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -10) n.x = w + 10;
        else if (n.x > w + 10) n.x = -10;
        if (n.y < -10) n.y = h + 10;
        else if (n.y > h + 10) n.y = -10;
        if (pointer.active) {
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 220 * 220 && d2 > 1) {
            const f = 0.012 * (1 - Math.sqrt(d2) / 220);
            n.x += dx * f;
            n.y += dy * f;
          }
        }
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      ctx!.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]!;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]!;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx!.strokeStyle = `rgba(${accent},${(1 - d / LINK) * 0.28})`;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
        if (pointer.active) {
          const d = Math.hypot(a.x - pointer.x, a.y - pointer.y);
          if (d < POINTER_LINK) {
            ctx!.strokeStyle = `rgba(${accent2},${(1 - d / POINTER_LINK) * 0.7})`;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(pointer.x, pointer.y);
            ctx!.stroke();
          }
        }
        ctx!.fillStyle = `rgba(${accent},0.75)`;
        ctx!.beginPath();
        ctx!.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      if (pointer.active) {
        ctx!.fillStyle = `rgba(${accent2},0.9)`;
        ctx!.beginPath();
        ctx!.arc(pointer.x, pointer.y, 3, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const loop = () => {
      step();
      draw();
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduce || running) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = e.clientY >= r.top && e.clientY <= r.bottom;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    readColors();
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => (e?.isIntersecting ? start() : stop()), { threshold: 0 });
    io.observe(host);
    const themeObserver = new MutationObserver(() => {
      readColors();
      if (!running) draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="neural" aria-hidden="true" />;
}
