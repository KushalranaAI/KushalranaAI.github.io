import { useEffect, useRef, useState } from "react";
import { profile, socials } from "../data/profile";
import { Icon } from "./Icon";
import { Magnetic } from "./Magnetic";
import { Reveal } from "./Reveal";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${profile.email}`;
      return;
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <Reveal>
          <p className="eyebrow">06 · Contact</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 id="contact-title" className="contact-title">
            Let's build something <em className="serif grad">that ships.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="section-lead">Open to conversations about AI engineering roles, agentic systems and interesting ML problems.</p>
        </Reveal>

        <Reveal delay={0.15} className="contact-actions">
          <Magnetic>
            <a className="btn btn-primary btn-lg" href={`mailto:${profile.email}`} data-cursor="Email">
              <Icon name="mail" /> {profile.email}
            </a>
          </Magnetic>
          <Magnetic>
            <button className="btn btn-lg" type="button" onClick={copy}>
              <Icon name={copied ? "check" : "copy"} /> <span aria-live="polite">{copied ? "Copied!" : "Copy email"}</span>
            </button>
          </Magnetic>
        </Reveal>

        <Reveal delay={0.2}>
          <ul className="social center" aria-label="Profiles">
            {socials.map((s) => (
              <li key={s.id}>
                <a href={s.href} target="_blank" rel="noopener" aria-label={s.label} data-cursor={s.label}>
                  <Icon name={s.id as "github"} />
                </a>
              </li>
            ))}
            <li>
              <a href={profile.resume} target="_blank" rel="noopener" aria-label="Résumé (PDF)" data-cursor="Résumé">
                <Icon name="download" />
              </a>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
