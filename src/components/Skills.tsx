import { motion } from "motion/react";
import { useState } from "react";
import { skillGroups } from "../data/skills";
import { Reveal } from "./Reveal";

export function Skills() {
  const [active, setActive] = useState(skillGroups[0]!.id);
  const group = skillGroups.find((g) => g.id === active)!;

  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <header className="section-head">
          <Reveal>
            <p className="eyebrow">05 · Skills</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="skills-title">
              What I work <em className="serif">with.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="section-lead">Grouped by what I use it for. Everything here has been in production or in a project on this page.</p>
          </Reveal>
        </header>

        <Reveal delay={0.1}>
          <div className="skills">
            <ul className="skill-list" aria-label="Skill areas">
              {skillGroups.map((g, i) => (
                <li key={g.id}>
                  <button
                    type="button"
                    className={`skill-btn${active === g.id ? " active" : ""}`}
                    aria-pressed={active === g.id}
                    onClick={() => setActive(g.id)}
                    onMouseEnter={() => setActive(g.id)}
                    data-cursor="View"
                  >
                    <i>{String(i + 1).padStart(2, "0")}</i>
                    <span>{g.title}</span>
                    <em>{g.items.length}</em>
                  </button>
                </li>
              ))}
            </ul>

            <div className="skill-panel" aria-live="polite">
              <motion.div key={group.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <h3>{group.title}</h3>
                <p>{group.blurb}</p>
                <ul className="chips big">
                  {group.items.map((item, i) => (
                    <motion.li key={item} initial={{ opacity: 0, y: 12, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: i * 0.035, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                      {item}
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
