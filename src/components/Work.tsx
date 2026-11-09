import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cases, type CaseStudy } from "../data/cases";
import { useScroll as useSmoothScroll } from "../hooks/useLenis";
import { CaseModal } from "./CaseModal";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";

function StackCard({
  study,
  index,
  progress,
  onOpen,
}: {
  study: CaseStudy;
  index: number;
  progress: MotionValue<number>;
  onOpen: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  const n = cases.length;
  // Each card shrinks slightly as the ones after it slide over it.
  const scale = useTransform(progress, [index / n, 1], [1, reduce ? 1 : 1 - 0.045 * (n - 1 - index)]);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div className="stack-item" style={{ ["--i" as string]: index }}>
      <motion.article
        className="case-card"
        style={{ scale }}
        onPointerMove={onMove}
        onClick={() => onOpen(study.id)}
        data-cursor="Open"
      >
        <span className="case-num" aria-hidden="true">
          {study.num}
        </span>
        <div className="case-main">
          <p className="case-tags">
            {study.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </p>
          <h3>{study.title}</h3>
          <p className="case-hook">{study.hook}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(study.id);
            }}
            aria-label={`Read the case study: ${study.title}`}
          >
            Read case study <Icon name="arrow" />
          </button>
        </div>
        <ul className="case-metrics">
          {study.metrics.map((m) => (
            <li key={m.label}>
              <b>{m.value}</b>
              <span>{m.label}</span>
            </li>
          ))}
        </ul>
      </motion.article>
    </div>
  );
}

export function Work() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { lock, unlock } = useSmoothScroll();
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start 80%", "end end"] });

  const open = useCallback((id: string) => setOpenId(id), []);
  const close = useCallback(() => setOpenId(null), []);

  // Freeze the page behind the panel
  useEffect(() => {
    if (!openId) return;
    lock();
    document.documentElement.classList.add("modal-open");
    return () => {
      unlock();
      document.documentElement.classList.remove("modal-open");
    };
  }, [openId, lock, unlock]);

  const study = cases.find((c) => c.id === openId);

  return (
    <section className="section work" id="work" aria-labelledby="work-title">
      <div className="container">
        <header className="section-head">
          <Reveal>
            <p className="eyebrow">01 · Selected work</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="work-title">
              Four systems <em className="serif">in production.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="section-lead">
              Built at Aviara Labs. The code is private, so each card tells the story: the problem, what I built and what it does
              today. Open one for the architecture.
            </p>
          </Reveal>
        </header>

        <div className="stack" ref={stackRef}>
          {cases.map((c, i) => (
            <StackCard key={c.id} study={c} index={i} progress={scrollYProgress} onOpen={open} />
          ))}
        </div>
      </div>

      <AnimatePresence>{study && <CaseModal key="modal" study={study} onClose={close} onSelect={open} />}</AnimatePresence>
    </section>
  );
}
