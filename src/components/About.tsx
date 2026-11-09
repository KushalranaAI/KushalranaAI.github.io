import { certs } from "../data/profile";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";

export function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="container">
        <header className="section-head">
          <Reveal>
            <p className="eyebrow">05 · About</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="about-title">
              Engineer first, <em className="serif">then AI.</em>
            </h2>
          </Reveal>
        </header>

        <div className="bento">
          <Reveal className="bento-cell b-story">
            <p>
              I like owning a system from the first architecture sketch to the dashboards that watch it in production. Most of my
              work sits where models meet real software: ML that has to price thousands of rooms every day, and agents that answer
              enterprise questions without ever crossing a tenant boundary.
            </p>
            <p>
              I care about the unglamorous parts that make AI reliable: clean data pipelines, evaluation, tracing, access control
              and APIs other teams can depend on. Outside work I build open-source learning platforms, because explaining
              something end to end is the best way I know to really understand it.
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
            <p>
              <b>B.Tech, Computer Science &amp; Engineering</b>
              <br />
              I.K. Gujral Punjab Technical University
              <br />
              2020–2024 · CGPA 8.0/10
            </p>
          </Reveal>

          <Reveal delay={0.16} className="bento-cell b-certs">
            <p className="cell-label">Certifications</p>
            <ul className="cert-list">
              {certs.map((c) => (
                <li key={c.href}>
                  <a href={c.href} target="_blank" rel="noopener" data-cursor="View">
                    <Icon name="award" />
                    <span>{c.title}</span>
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
