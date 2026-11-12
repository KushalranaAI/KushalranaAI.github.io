import { certs, education } from "../data/profile";
import { skillGroups } from "../data/skills";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";

/** Who I am, what I work with, and the paper trail, in one section. */
export function About() {
  const degree = education[0]!;
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="container">
        <header className="section-head">
          <Reveal>
            <p className="eyebrow">04 · About</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="about-title">
              Engineer first, <em className="serif">then AI.</em>
            </h2>
          </Reveal>
        </header>

        <div className="about-grid">
          <Reveal className="about-story">
            <div className="story-photo">
              <img src="/assets/img/kushal-casual.webp" width={72} height={72} alt="Kushal Rana" loading="lazy" />
              <span>
                <b>Kushal Rana</b>
                Software Engineer · AI &amp; Backend · Noida
              </span>
            </div>
            <p>
              I work in two halves that feed each other: AI (fine-tuning, agents, RAG) and the distributed backends underneath it. I like
              owning a system from the first sketch to the dashboards that watch it in production.
            </p>
            <p>
              I care most about the unglamorous parts that make AI reliable: clean data, evaluation, tracing, access control and APIs
              other teams can depend on.
            </p>
          </Reveal>

          <Reveal delay={0.08} className="about-facts">
            <div className="fact">
              <p className="cell-label">Education</p>
              <b>{degree.title}</b>
              <span>
                {degree.school} · {degree.when} · {degree.grade}
              </span>
            </div>
            <div className="fact">
              <p className="cell-label">Recognition</p>
              <b>3rd of 60+ teams</b>
              <span>Bharat Tech Experience Hackathon, 2024</span>
            </div>
            <div className="fact">
              <p className="cell-label">Certifications</p>
              <ul className="cert-list">
                {certs.map((c) => (
                  <li key={c.href}>
                    <a href={c.href} target="_blank" rel="noopener" data-cursor="View">
                      <img className="cert-logo" src={c.logo} alt="" width={22} height={22} loading="lazy" />
                      <span>{c.title}</span>
                      <Icon name="arrow-up-right" className="cert-arrow" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <h3 className="subhead" id="skills">
            Toolkit
          </h3>
          <dl className="toolkit">
            {skillGroups.map((g) => (
              <div key={g.id}>
                <dt>{g.title}</dt>
                <dd>
                  <ul>
                    {g.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
