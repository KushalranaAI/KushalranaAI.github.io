import { motion } from "motion/react";
import { useState } from "react";
import { roles } from "../data/experience";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";

export function Experience() {
  const [active, setActive] = useState(roles[0]!.id);
  const role = roles.find((r) => r.id === active)!;

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
    const next = roles[(i + dir + roles.length) % roles.length]!;
    setActive(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  };

  return (
    <section className="section" id="experience" aria-labelledby="exp-title">
      <div className="container">
        <header className="section-head">
          <Reveal>
            <p className="eyebrow">03 · Experience</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="exp-title">
              Where I've <em className="serif">worked.</em>
            </h2>
          </Reveal>
        </header>

        <Reveal delay={0.1}>
          <div className="exp">
            <div className="exp-tabs" role="tablist" aria-label="Roles" aria-orientation="vertical">
              {roles.map((r, i) => (
                <button
                  key={r.id}
                  id={`tab-${r.id}`}
                  role="tab"
                  type="button"
                  aria-selected={active === r.id}
                  aria-controls={`panel-${r.id}`}
                  tabIndex={active === r.id ? 0 : -1}
                  className={`exp-tab${active === r.id ? " active" : ""}`}
                  onClick={() => setActive(r.id)}
                  onKeyDown={(e) => onKey(e, i)}
                >
                  {active === r.id && <motion.span layoutId="exp-marker" className="exp-marker" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                  <span className="exp-tab-co">{r.company}</span>
                  <span className="exp-tab-date">{r.date}</span>
                </button>
              ))}
            </div>

            <div className="exp-panel" role="tabpanel" id={`panel-${role.id}`} aria-labelledby={`tab-${role.id}`}>
              <motion.div key={role.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                <p className="exp-meta">
                  <span>{role.date}</span>
                  <span>
                    <Icon name="pin" /> {role.place}
                  </span>
                </p>
                <h3>
                  {role.title} <em className="serif">· {role.company}</em>
                </h3>
                <p className="exp-summary">{role.summary}</p>
                <ul className="exp-points">
                  {role.points.map((p, i) => (
                    <motion.li key={p} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + i * 0.08, duration: 0.45 }}>
                      {p}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
