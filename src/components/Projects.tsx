import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { projectCases } from "../data/projectCases";
import { buildAreas, builds, personalProjects, platformLinks, statusLabel, type BuildArea } from "../data/projects";
import { useCaseHash } from "../hooks/useCaseHash";
import { CaseModal } from "./CaseModal";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";

const caseIds = projectCases.map((c) => c.id);
const ease = [0.22, 1, 0.36, 1] as const;
/** Node centres on the map, in percent: a 2 × 2 grid in the order of `personalProjects`. */
const centre = (i: number) => ({ x: i % 2 ? 75 : 25, y: i < 2 ? 25 : 75 });

/**
 * The four systems drawn the way they connect. The map is the navigation: pick a node and the panel beside it
 * shows that system. Built systems are solid and open a case study; the rest are dashed and say "coming soon".
 */
function PlatformMap({ onOpen }: { onOpen: (id: string) => void }) {
  const [id, setId] = useState(personalProjects[0]!.id);
  const reduce = useReducedMotion();
  const p = personalProjects.find((x) => x.id === id)!;
  const hasStudy = caseIds.includes(p.id);
  const at = (pid: string) => centre(personalProjects.findIndex((x) => x.id === pid));

  return (
    <div className="pm">
      <div className="pm-map" role="group" aria-label="Platform map: choose a system">
        <svg className="pm-wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {platformLinks.map((l) => (
            <line key={l.label} className={l.a === id || l.b === id ? "is-active" : ""} x1={at(l.a).x} y1={at(l.a).y} x2={at(l.b).x} y2={at(l.b).y} />
          ))}
        </svg>
        {platformLinks.map((l) => (
          <span key={l.label} className={`pm-wire-label${l.a === id || l.b === id ? " is-active" : ""}`} style={{ left: `${l.x}%`, top: `${l.y}%` }} aria-hidden="true">
            {l.label}
          </span>
        ))}
        {personalProjects.map((n) => (
          <button key={n.id} type="button" className={`pm-node is-${n.status}${n.id === id ? " is-selected" : ""}`} aria-pressed={n.id === id} onClick={() => setId(n.id)}>
            {n.id === id && <motion.span layoutId="pm-ring" className="pm-ring" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
            <span className="pm-num">{n.num}</span>
            <span className="pm-name">{n.name}</span>
            <span className="pm-role">{n.role}</span>
            {/* Short label here so it never wraps in a narrow node; the panel shows the full one. */}
            <span className={`status-pill is-${n.status}`}>{n.status === "built" ? "Built" : statusLabel[n.status]}</span>
          </button>
        ))}
      </div>

      <div className="pm-panel" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={p.id}
            className="pm-detail"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease }}
          >
            <p className="pm-kicker">
              {p.num} · {p.proves}
            </p>
            <h3 className="pm-title">
              {p.name} <span className={`status-pill is-${p.status}`}>{statusLabel[p.status]}</span>
            </h3>
            <p className="pm-tagline">{p.tagline}</p>

            {p.results ? (
              <ul className="pm-results">
                {p.results.map((m) => (
                  <li key={m.label}>
                    <b>{m.value}</b>
                    <span>{m.label}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                <p className="proj-label">Will publish</p>
                <ul className="proj-publishes">
                  {p.publishes?.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="pm-connects">
              <b>In the platform</b>
              {p.connects}
            </p>
            <ul className="chips small">
              {p.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>

            <div className="pm-actions">
              {hasStudy ? (
                <button type="button" className="btn btn-primary" onClick={() => onOpen(p.id)} aria-haspopup="dialog">
                  Read the case study <Icon name="arrow" />
                </button>
              ) : (
                <span className="project-soon">Coming soon. Its case study lands with its first measured numbers.</span>
              )}
              {p.repo && (
                <a className="project-link" href={p.repo} target="_blank" rel="noopener">
                  <Icon name="github" /> Repository
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
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
        {/* Filters only earn their space once there is more than one area to choose between. */}
        <div className="filters" role="group" aria-label="Filter builds by area" hidden={filters.length < 3}>
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
                  <a className="build-card" href={href} target="_blank" rel="noopener">
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
  const [openId, open] = useCaseHash(caseIds, "projects");
  const close = useCallback(() => open(null), [open]);
  const study = projectCases.find((c) => c.id === openId);

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
              One platform of four connected systems. Two are built and measured, and open as full case studies. Two are coming
              soon. A number appears here only once it has been measured.
            </p>
          </Reveal>
        </header>

        <Reveal delay={0.1}>
          <div className="flagship-head">
            <h3 className="subhead">Flagship · one platform</h3>
            <p className="pm-legend">
              <span className="lg-built">Built</span>
              <span className="lg-soon">Coming soon</span>
              <span className="lg-wire">Planned connection</span>
            </p>
          </div>
          <PlatformMap onOpen={open} />
        </Reveal>

        <Builds />
      </div>

      <AnimatePresence>{study && <CaseModal key="modal" list={projectCases} study={study} onClose={close} onSelect={open} />}</AnimatePresence>
    </section>
  );
}
