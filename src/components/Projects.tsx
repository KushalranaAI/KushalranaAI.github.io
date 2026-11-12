import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { buildAreas, builds, personalProjects, statusLabel, type BuildArea, type PersonalProject } from "../data/projects";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";

function ProjectRow({ p, open, onToggle }: { p: PersonalProject; open: boolean; onToggle: () => void }) {
  const reduce = useReducedMotion();
  const panelId = `proj-${p.id}`;
  return (
    <li className={`proj-row${open ? " is-open" : ""}`}>
      <button type="button" className="proj-head" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
        <span className="proj-num" aria-hidden="true">
          {p.num}
        </span>
        <span className="proj-main">
          <span className="proj-name">
            {p.name}
            <span className={`status-pill is-${p.status}`}>{statusLabel[p.status]}</span>
          </span>
          <span className="proj-tagline">{p.tagline}</span>
        </span>
        <span className="proj-window">{p.window}</span>
        <span className="proj-toggle" aria-hidden="true">
          <Icon name="chevron" />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            className="proj-panel"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="proj-detail">
              <dl className="proj-meta">
                <div>
                  <dt>Proves</dt>
                  <dd>{p.proves}</dd>
                </div>
                <div>
                  <dt>Connects</dt>
                  <dd>{p.connects}</dd>
                </div>
              </dl>
              <div>
                <p className="proj-label">{p.results ? "Results" : "Will publish"}</p>
                {p.results ? (
                  <ul className="proj-publishes">
                    {p.results.map((m) => (
                      <li key={m.label}>
                        <b>{m.value}</b> {m.label}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="proj-publishes">
                    {p.publishes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="proj-foot">
                <ul className="chips small">
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <div className="project-links">
                  {p.caseStudy && (
                    <a className="project-link" href={p.caseStudy} target="_blank" rel="noopener">
                      <Icon name="external" /> Case study
                    </a>
                  )}
                  {p.repo ? (
                    <a className="project-link" href={p.repo} target="_blank" rel="noopener">
                      <Icon name="github" /> Repository
                    </a>
                  ) : (
                    <span className="project-soon">Repo opens when the build starts</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

const PREVIEW = 6;
const areaLabel = Object.fromEntries(buildAreas.map((a) => [a.id, a.label])) as Record<BuildArea, string>;

/** Every other personal project in one filterable grid, so the list can grow without the page growing. */
function Builds() {
  const [area, setArea] = useState<BuildArea | "all">("all");
  const [all, setAll] = useState(false);
  const reduce = useReducedMotion();

  // Only offer filters that have something in them.
  const filters = useMemo(
    () => [
      { id: "all" as const, label: "All", count: builds.length },
      ...buildAreas.map((a) => ({ ...a, count: builds.filter((b) => b.area === a.id).length })).filter((a) => a.count > 0),
    ],
    [],
  );
  const items = builds.filter((b) => area === "all" || b.area === area);
  const shown = all ? items : items.slice(0, PREVIEW);

  return (
    <div className="builds">
      <div className="builds-head">
        <h3 className="subhead">Other builds</h3>
        <div className="filters" role="group" aria-label="Filter builds by area">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`filter${area === f.id ? " active" : ""}`}
              aria-pressed={area === f.id}
              onClick={() => {
                setArea(f.id);
                setAll(false);
              }}
            >
              {area === f.id && <motion.span layoutId="build-pill" className="filter-pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <span>
                {f.label} <i>{f.count}</i>
              </span>
            </button>
          ))}
        </div>
      </div>

      <ul className="build-grid" aria-live="polite">
        <AnimatePresence initial={false} mode="popLayout">
          {shown.map((b) => {
            const href = b.live ?? b.repo;
            const body = (
              <>
                <span className="build-top">
                  <span className="build-area">{areaLabel[b.area]}</span>
                  <span className={`status-pill is-${b.status}`}>{statusLabel[b.status]}</span>
                </span>
                <span className="build-name">{b.name}</span>
                <span className="build-blurb">{b.blurb}</span>
                <span className="build-stack">{b.stack.join(" · ")}</span>
                {href && (
                  <span className="build-arrow" aria-hidden="true">
                    <Icon name="arrow-up-right" />
                  </span>
                )}
              </>
            );
            return (
              <motion.li
                key={b.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {href ? (
                  <a className="build-card" href={href} target="_blank" rel="noopener" data-cursor={b.live ? "Open" : "Repo"}>
                    {body}
                  </a>
                ) : (
                  <div className="build-card is-static">{body}</div>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      {items.length > PREVIEW && (
        <button type="button" className="earlier-toggle" aria-expanded={all} onClick={() => setAll((v) => !v)}>
          {all ? "Show fewer" : `Show all ${items.length}`}
          <Icon name="chevron" />
        </button>
      )}
    </div>
  );
}

export function Projects() {
  const [openId, setOpenId] = useState<string | null>(personalProjects[0]?.id ?? null);

  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <header className="section-head">
          <Reveal>
            <p className="eyebrow">02 · Projects</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="projects-title">
              Built on my own, <em className="serif">outside work.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="section-lead">
              A flagship platform of four connected systems, plus side builds I pick up along the way. Results show up here only once
              they're measured.
            </p>
          </Reveal>
        </header>

        <Reveal delay={0.1}>
          <div className="flagship-head">
            <h3 className="subhead">Flagship · one platform</h3>
            <p>Model calls go through Switchboard; reports and alerts leave through Relay.</p>
          </div>
          <ol className="proj-list">
            {personalProjects.map((p) => (
              <ProjectRow key={p.id} p={p} open={openId === p.id} onToggle={() => setOpenId((cur) => (cur === p.id ? null : p.id))} />
            ))}
          </ol>
        </Reveal>

        <Builds />
      </div>
    </section>
  );
}
