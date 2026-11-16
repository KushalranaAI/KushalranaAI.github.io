import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { profile, proof, socials } from "../data/profile";
import { useScroll } from "../hooks/useScroll";
import { Icon } from "./Icon";
import { Magnetic } from "./Magnetic";

/** No entrance animation on purpose: this is the first thing painted, straight from the prerendered HTML. */
export function Hero() {
  const { scrollTo } = useScroll();
  const reduce = useReducedMotion();

  // Photo tilt follows the pointer
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 140, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 140, damping: 18 });

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="status">
            <span className="pulse" aria-hidden="true" />
            {profile.title} at {profile.company} · {profile.location}
          </p>

          <h1 id="hero-title" className="hero-name">
            {profile.first} <span className="serif grad">{profile.last}</span>
          </h1>

          <p className="hero-role">
            <strong>{profile.role}</strong>
            <em>{profile.headline}</em>
          </p>

          <p className="lead">
            {profile.intro}
          </p>

          <ul className="proof" aria-label="Highlights">
            {proof.map((p) => (
              <li key={p.label}>
                <b>{p.value}</b>
                <span>{p.label}</span>
              </li>
            ))}
          </ul>

          <div className="hero-actions">
            <div className="cta-row">
              <Magnetic>
                <button className="btn btn-primary" type="button" onClick={() => scrollTo("work")}>
                  See my work <Icon name="arrow" />
                </button>
              </Magnetic>
              <Magnetic>
                <a className="btn" href={profile.resume} download>
                  <Icon name="download" /> Résumé
                </a>
              </Magnetic>
            </div>

            <ul className="social" aria-label="Profiles">
              {socials.map((s) => (
                <li key={s.id}>
                  <a href={s.href} target="_blank" rel="noopener" aria-label={s.label}>
                    <Icon name={s.id as "github"} />
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${profile.email}`} aria-label="Email">
                  <Icon name="mail" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="hero-visual"
          onPointerMove={(e) => {
            if (e.pointerType !== "mouse" || reduce) return;
            const r = e.currentTarget.getBoundingClientRect();
            mx.set((e.clientX - r.left) / r.width - 0.5);
            my.set((e.clientY - r.top) / r.height - 0.5);
          }}
          onPointerLeave={() => {
            mx.set(0);
            my.set(0);
          }}
        >
          <motion.div className="portrait" style={{ rotateX: rx, rotateY: ry }}>
            <img src={profile.photo} width={720} height={900} alt={`Portrait of ${profile.name}`} fetchPriority="high" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
