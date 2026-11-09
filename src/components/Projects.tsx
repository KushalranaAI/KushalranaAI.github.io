import { earlierProjects, personalProjects, statusLabel, type PersonalProject } from "../data/projects";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";

function ProjectCard({ p, index }: { p: PersonalProject; index: number }) {
  return (
    <Reveal delay={Math.min(index * 0.07, 0.25)} className="proj-wrap">
      <article className="proj-card">
        <header className="proj-top">
          <span className="proj-num" aria-hidden="true">
            {p.num}
          </span>
          <span className={`status-pill is-${p.status}`}>{statusLabel[p.status]}</span>
        </header>

        <h3>{p.name}</h3>
        <p className="proj-tagline">{p.tagline}</p>

        <dl className="proj-meta">
          <div>
            <dt>Proves</dt>
            <dd>{p.proves}</dd>
          </div>
          <div>
            <dt>Build window</dt>
            <dd>{p.window}</dd>
          </div>
          <div>
            <dt>Fits the platform</dt>
            <dd>{p.connects}</dd>
          </div>
        </dl>

        <div>
          <p className="proj-label">{p.results ? "Results" : "Will publish"}</p>
          {p.results ? (
            <ul className="case-metrics proj-results">
              {p.results.map((m) => (
                <li key={m.label}>
                  <b>{m.value}</b>
                  <span>{m.label}</span>
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
      </article>
    </Reveal>
  );
}

export function Projects() {
  return (
    <section className="section projects" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <header className="section-head">
          <Reveal>
            <p className="eyebrow">02 · Personal projects</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="projects-title">
              Four systems, <em className="serif">one platform.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="section-lead">
              Systems I design and build myself to prove production judgment, each aimed at a gap in my own record. They plug into one
              another: model calls go through Switchboard, and KynAI's reports and Switchboard's alerts leave through Relay.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="honesty">
              <Icon name="award" /> Personal projects on synthetic data, tested under load and fault injection. Kept separate from my
              Aviara work, which has real users and real revenue. Numbers appear here only once they have been measured.
            </p>
          </Reveal>
        </header>

        <div className="proj-grid">
          {personalProjects.map((p, i) => (
            <ProjectCard key={p.id} p={p} index={i} />
          ))}
        </div>

        <h3 className="subhead">Earlier projects</h3>
        <ul className="earlier">
          {earlierProjects.map((p, i) => (
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
      </div>
    </section>
  );
}
