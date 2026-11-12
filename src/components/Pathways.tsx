import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { pathways, type Pathway } from "../data/pathways";
import { socials } from "../data/profile";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";

function RagVisual() {
  const steps = ["Docs", "Chunk", "Embed", "Hybrid + rerank", "Agents · MCP"];
  return (
    <div className="rag-visual" aria-hidden="true">
      <div className="rag-flow">
        {steps.map((s, i) => (
          <span key={s} className={i === 3 ? "hl" : i === 4 ? "hl2" : ""} style={{ ["--d" as string]: `${i * 0.35}s` }}>
            {s}
          </span>
        ))}
      </div>
      <div className="rag-code">
        <span>$</span> claude mcp add nimbus-docs -- python mcp_servers/docs_server.py
        <br />
        <span>✓</span> 30 days · 15 projects · offline test suite
      </div>
    </div>
  );
}

function PathwayCard({ p, index }: { p: Pathway; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      className="lab-card"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="lab-media">
        {p.image ? <img src={p.image} width={1200} height={750} loading="lazy" alt={p.alt ?? ""} draggable={false} /> : <RagVisual />}
        <span className="lab-index" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="lab-body">
        <h3>{p.title}</h3>
        <p>{p.blurb}</p>
        <ul className="lab-stats">
          {p.stats.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div className="project-links">
          {p.live && (
            <a className="project-link" href={p.live} target="_blank" rel="noopener">
              <Icon name="external" /> Start learning
            </a>
          )}
          <a className="project-link" href={p.repo} target="_blank" rel="noopener">
            <Icon name="github" /> Repository
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export function Pathways() {
  const reduce = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });

  const measure = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 1);
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const page = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(460, el.clientWidth * 0.85), behavior: reduce ? "auto" : "smooth" });
  };

  // Mouse drag-to-scroll (touch and trackpads already scroll natively)
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || (e.target as HTMLElement).closest("a, button")) return;
    const el = railRef.current!;
    drag.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false };
    el.classList.add("dragging");
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.down) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 3) d.moved = true;
    railRef.current!.scrollLeft = d.startLeft - dx;
  };
  const endDrag = () => {
    drag.current.down = false;
    railRef.current?.classList.remove("dragging");
  };

  return (
    <section className="section lab" id="learning" aria-labelledby="learning-title">
      <div className="container">
        <header className="section-head split-head">
          <div>
            <Reveal>
              <p className="eyebrow">03 · Learning</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="learning-title">
                I learn in public, <em className="serif">for free.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="section-lead">
                When I learn a field, I publish the route as an open-source course with runnable projects and simulators, so anyone can
                follow it.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.12} className="rail-controls">
            <button type="button" className="icon-btn" onClick={() => page(-1)} disabled={!canPrev} aria-label="Scroll pathways left">
              <Icon name="chevron-left" />
            </button>
            <button type="button" className="icon-btn" onClick={() => page(1)} disabled={!canNext} aria-label="Scroll pathways right">
              <Icon name="chevron" />
            </button>
          </Reveal>
        </header>

      </div>

      <div
        className="rail"
        ref={railRef}
        onScroll={measure}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        data-cursor="Drag"
        tabIndex={0}
        role="region"
        aria-label="Learning pathway cards, scroll horizontally"
      >
        {pathways.map((p, i) => (
          <PathwayCard key={p.id} p={p} index={i} />
        ))}
      </div>

      <div className="container">
        <div className="rail-progress" aria-hidden="true">
          <motion.i style={{ scaleX: progress }} />
        </div>
        <p className="lab-foot">
          {pathways.length} pathways, all free on{" "}
          <a href={socials[0]!.href} target="_blank" rel="noopener">
            GitHub
          </a>
          .
        </p>
      </div>
    </section>
  );
}
