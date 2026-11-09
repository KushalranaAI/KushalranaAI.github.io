import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { cases, type CaseStudy } from "../data/cases";
import { Diagram } from "./Diagram";
import { Icon } from "./Icon";
import { Rich } from "./Reveal";

interface Props {
  study: CaseStudy;
  onClose: () => void;
  onSelect: (id: string) => void;
}

function Story({ items, start }: { items: { label: string; body: string }[]; start: number }) {
  return (
    <dl className="modal-story">
      {items.map((s, i) => (
        <div key={s.label}>
          <dt>
            <i>{String(start + i + 1).padStart(2, "0")}</i>
            {s.label}
          </dt>
          <dd>
            <Rich text={s.body} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Full case study in a slide-over panel. Esc closes, focus is trapped inside, and the page behind is locked. */
export function CaseModal({ study, onClose, onSelect }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const idx = cases.findIndex((c) => c.id === study.id);
  const prev = cases[(idx - 1 + cases.length) % cases.length]!;
  const next = cases[(idx + 1) % cases.length]!;

  // Focus handling: move focus in on open, trap Tab, restore on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [onClose]);

  // Start at the top when switching between case studies
  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 0 });
  }, [study.id]);

  const head: { label: string; body: string }[] = [
    { label: "Problem", body: study.problem },
    { label: "What I built", body: study.built },
    ...(study.role ? [{ label: "My role", body: study.role }] : []),
    ...(study.sections ?? []),
  ];
  const result = { label: "Result", body: study.result };

  return (
    <motion.div
      className="modal-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />
      <motion.div
        ref={panelRef}
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-title"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="modal-bar">
          <span className="modal-count">
            {study.num} <i>/ {String(cases.length).padStart(2, "0")}</i>
          </span>
          <div className="modal-nav">
            <button type="button" className="icon-btn" onClick={() => onSelect(prev.id)} aria-label={`Previous: ${prev.title}`}>
              <Icon name="chevron-left" />
            </button>
            <button type="button" className="icon-btn" onClick={() => onSelect(next.id)} aria-label={`Next: ${next.title}`}>
              <Icon name="chevron" />
            </button>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close case study" data-autofocus>
              <Icon name="close" />
            </button>
          </div>
        </div>

        <div className="modal-scroll" ref={scrollerRef} data-lenis-prevent>
          <motion.div key={study.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <p className="case-tags">
              {study.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </p>
            <h2 id="case-title" className="modal-title">
              {study.title}
            </h2>

            <ul className="modal-metrics">
              {study.metrics.map((m) => (
                <li key={m.label}>
                  <b>{m.value}</b>
                  <span>{m.label}</span>
                </li>
              ))}
            </ul>

            <Diagram key={study.id} data={study.diagram} />

            <Story items={head} start={0} />

            {study.decisions && (
              <div className="modal-block">
                <h3 className="modal-h">Key decisions</h3>
                <ul className="decisions">
                  {study.decisions.map((d) => (
                    <li key={d.title}>
                      <p className="decision-q">{d.title}</p>
                      <p className="decision-a">
                        <span className="tag-chose">Chose</span> {d.chose}
                        {d.over && (
                          <>
                            {" "}
                            <span className="tag-over">over</span> {d.over}
                          </>
                        )}
                      </p>
                      <p className="decision-why">{d.why}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {study.problems && (
              <div className="modal-block">
                <h3 className="modal-h">Hardest problem</h3>
                {study.problems.map((p) => (
                  <article className="problem" key={p.title}>
                    <h4>{p.title}</h4>
                    <dl>
                      <div>
                        <dt>Symptom</dt>
                        <dd>{p.symptom}</dd>
                      </div>
                      <div>
                        <dt>Real cause</dt>
                        <dd>{p.cause}</dd>
                      </div>
                      <div>
                        <dt>Fix</dt>
                        <dd>{p.fix}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            )}

            <Story items={[result]} start={head.length} />

            <ul className="chips">
              {study.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>

            {study.links && (
              <div className="modal-links">
                {study.links.map((l) => (
                  <a key={l.href} className="project-link" href={l.href} target="_blank" rel="noopener">
                    <Icon name="external" /> {l.label}
                  </a>
                ))}
              </div>
            )}

            <button type="button" className="modal-next" onClick={() => onSelect(next.id)} data-cursor="Next">
              <small>Next case study</small>
              <span>
                {next.title} <Icon name="arrow" />
              </span>
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
