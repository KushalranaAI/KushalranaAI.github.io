import { certs, education } from "../data/profile";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";

export function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="container">
        <header className="section-head">
          <Reveal>
            <p className="eyebrow">06 · About</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="about-title">
              Engineer first, <em className="serif">then AI.</em>
            </h2>
          </Reveal>
        </header>

        <div className="bento">
          <Reveal className="bento-cell b-story">
            <div className="story-photo">
              <img src="/assets/img/kushal-casual.webp" width={72} height={72} alt="Kushal Rana" loading="lazy" />
              <span>
                <b>Kushal Rana</b>
                Software Engineer · AI &amp; Backend · Noida
              </span>
            </div>
            <p>
              I work in two halves that feed each other. On the AI side: LLM fine-tuning, agentic systems and RAG. On the backend
              side: distributed, scalable architectures, system design and low-level design. I like owning a system from the first
              architecture sketch to the dashboards that watch it in production: ML that has to price thousands of rooms every day,
              and agents that answer enterprise questions without ever crossing a tenant boundary.
            </p>
            <p>
              I care about the unglamorous parts that make AI reliable: clean data pipelines, evaluation, tracing, access control
              and APIs other teams can depend on. Outside work I do two separate things: build personal projects that stress-test production patterns,
              and publish the roadmaps I follow as open-source learning pathways, because explaining something end to end is the
              best way I know to really understand it.
            </p>
          </Reveal>

          <Reveal delay={0.08} className="bento-cell b-hack">
            <span className="big-num">3rd</span>
            <p>
              <b>place out of 60+ teams</b>
              <br />
              Bharat Tech Experience Hackathon, 2024
            </p>
          </Reveal>

          <Reveal delay={0.12} className="bento-cell b-edu">
            <p className="cell-label">Education</p>
            <ol className="edu-list">
              {education.map((e) => (
                <li key={e.title}>
                  <b>{e.title}</b>
                  <span>{e.school}</span>
                  <span>
                    {e.when} · {e.grade}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.16} className="bento-cell b-certs">
            <p className="cell-label">Certifications</p>
            <ul className="cert-list">
              {certs.map((c) => (
                <li key={c.href}>
                  <a href={c.href} target="_blank" rel="noopener" data-cursor="View">
                    <img className="cert-logo" src={c.logo} alt="" width={26} height={26} loading="lazy" />
                    <span>
                      {c.title}
                      <small>{c.issuer}</small>
                    </span>
                    <Icon name="arrow-up-right" className="cert-arrow" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
