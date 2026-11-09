import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { earlierProjects, labFilters, labProjects, type LabProject } from "../data/lab";
import { socials } from "../data/profile";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";

type Filter = (typeof labFilters)[number]["id"];

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

function ProjectCard({ p, index }: { p: LabProject; index: number }) {
  return (
    <motion.article
      className="lab-card"
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
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
        <ul className="chips small">
          {p.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div className="project-links">
          {p.live && (
            <a className="project-link" href={p.live} target="_blank" rel="noopener">
              <Icon name="external" /> Live site
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

/** Teaser card for the personal project that hasn't shipped yet. Remove it from the rail once one lands. */
function NextCard() {
  return (
    <article className="lab-card lab-next">
      <div className="lab-media next-media" aria-hidden="true">
        <div className="build-lines">
          <i style={{ ["--w" as string]: "72%" }} />
          <i style={{ ["--w" as string]: "48%" }} />
          <i style={{ ["--w" as string]: "86%" }} />
          <i style={{ ["--w" as string]: "34%" }} />
          <i style={{ ["--w" as string]: "60%" }} />
        </div>
        <span className="next-plus">+</span>
      </div>
      <div className="lab-body">
        <p className="eyebrow">Coming next</p>
        <h3>A new personal project</h3>
        <p>A new build is on the way. I build in public, so it will show up on my GitHub the moment it has something worth running.</p>
        <div className="project-links">
          <a className="project-link" href="https://github.com/KushalranaAI" target="_blank" rel="noopener">
            <Icon name="github" /> Follow on GitHub
          </a>
        </div>
      </div>
    </article>
  );
}

export function Lab() {
  const [filter, setFilter] = useState<Filter>("all");
  const reduce = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });

  const projects = useMemo(() => labProjects.filter((p) => filter === "all" || p.tags.includes(filter)), [filter]);
  const earlier = useMemo(() => earlierProjects.filter((p) => filter === "all" || p.tags.includes(filter)), [filter]);

  const measure = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 1);
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    railRef.current?.scrollTo({ left: 0 });
    measure();
  }, [filter, measure]);

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
    <section className="section lab" id="lab" aria-labelledby="lab-title">
      <div className="container">
        <header className="section-head split-head">
          <div>
            <Reveal>
              <p className="eyebrow">02 · Personal projects &amp; open source</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="lab-title">
                Built in <em className="serif">public.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="section-lead">
                Complete, runnable learning platforms I build to go deep on a topic, and to help other engineers do the same.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.12} className="rail-controls">
            <button type="button" className="icon-btn" onClick={() => page(-1)} disabled={!canPrev} aria-label="Scroll projects left">
              <Icon name="chevron-left" />
            </button>
            <button type="button" className="icon-btn" onClick={() => page(1)} disabled={!canNext} aria-label="Scroll projects right">
              <Icon name="chevron" />
            </button>
          </Reveal>
        </header>

        <div className="filters" role="group" aria-label="Filter projects">
          {labFilters.map((f) => (
            <button key={f.id} type="button" className={`filter${filter === f.id ? " active" : ""}`} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {filter === f.id && <motion.span layoutId="filter-pill" className="filter-pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <span>{f.label}</span>
            </button>
          ))}
          <span className="filter-count" aria-live="polite">
            {projects.length + earlier.length} projects
          </span>
        </div>
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
        aria-label="Project cards, scroll horizontally"
      >
        {projects.map((p, i) => (
          <ProjectCard key={`${filter}-${p.id}`} p={p} index={i} />
        ))}
        {filter === "all" && <NextCard />}
      </div>

      <div className="container">
        <div className="rail-progress" aria-hidden="true">
          <motion.i style={{ scaleX: progress }} />
        </div>

        {earlier.length > 0 && (
          <>
            <h3 className="subhead">Earlier experiments</h3>
            <ul className="earlier">
              {earlier.map((p, i) => (
                <li key={p.title}>
                  <Reveal delay={i * 0.04} y={14}>
                    <a className="earlier-row" href={p.repo} target="_blank" rel="noopener" data-cursor="Repo">
                      <span className="earlier-n">{String(i + 1).padStart(2, "0")}</span>
                      <span className="earlier-title">{p.title}</span>
                      <span className="earlier-stack">{p.stack}</span>
                      <span className="earlier-arrow" aria-hidden="true">
                        <Icon name="arrow-up-right" />
                      </span>
                      <span className="earlier-blurb">{p.blurb}</span>
                    </a>
                  </Reveal>
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="lab-foot">
          More on <a href={socials[0]!.href} target="_blank" rel="noopener">GitHub</a>.
        </p>
      </div>
    </section>
  );
}
