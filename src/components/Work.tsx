import { AnimatePresence } from "motion/react";
import { useCallback } from "react";
import { cases } from "../data/cases";
import { roles } from "../data/experience";
import { useCaseHash } from "../hooks/useCaseHash";
import { CaseModal } from "./CaseModal";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";

const caseIds = cases.map((c) => c.id);

/**
 * Work and experience in one place: the Aviara Labs roles sit beside the systems built in them,
 * and earlier jobs follow as compact rows. Case studies open in a side panel.
 */
export function Work() {
  const [openId, open] = useCaseHash(caseIds, "work");
  const close = useCallback(() => open(null), [open]);

  const study = cases.find((c) => c.id === openId);
  const aviara = roles.filter((r) => r.company === "Aviara Labs");
  const earlier = roles.filter((r) => r.company !== "Aviara Labs");

  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="container">
        <header className="section-head">
          <Reveal>
            <p className="eyebrow">01 · Work</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="work-title">
              Four AI systems <em className="serif">in production.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="section-lead">
              Built at Aviara Labs for paying clients. The code is private, so each one opens as a case study: the problem, the
              architecture, the decisions and what it does today.
            </p>
          </Reveal>
        </header>

        <div className="work-grid">
          <Reveal className="work-co">
            <div className="co-sticky">
              <p className="co-name">Aviara Labs</p>
              <p className="co-meta">
                <Icon name="pin" /> Noida · Aug 2024 – present
              </p>
              <ol className="ladder" aria-label="Roles at Aviara Labs">
                {aviara.map((r, i) => (
                  <li key={r.id} className={i === 0 ? "is-now" : ""}>
                    <b>{r.title.replace("Software Development Engineer", "SDE")}</b>
                    <span>{r.date}</span>
                    <p>{r.summary}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <ol className="case-list" aria-label="Case studies">
            {cases.map((c, i) => (
              <li key={c.id}>
                <Reveal delay={Math.min(i * 0.06, 0.2)}>
                  <button type="button" className="case-row" onClick={() => open(c.id)} aria-haspopup="dialog">
                    <span className="case-row-num" aria-hidden="true">
                      {c.num}
                    </span>
                    <span className="case-row-body">
                      <span className="case-row-kind">{c.tags[0]}</span>
                      <span className="case-row-title">{c.title}</span>
                      <span className="case-row-hook">{c.hook}</span>
                      <span className="case-row-metrics">
                        {c.metrics.map((m) => (
                          <span key={m.label}>
                            <b>{m.value}</b> {m.label}
                          </span>
                        ))}
                      </span>
                    </span>
                    <span className="case-row-go" aria-hidden="true">
                      <Icon name="arrow-up-right" />
                    </span>
                  </button>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        {earlier.length > 0 && (
          <div className="earlier-roles">
            <p className="subhead">Before Aviara</p>
            {earlier.map((r) => (
              <Reveal key={r.id}>
                <article className="role-row">
                  <div>
                    <h3>
                      {r.title} <em className="serif">· {r.company}</em>
                    </h3>
                    <p className="role-meta">
                      {r.date} · {r.place}
                    </p>
                  </div>
                  <p className="role-sum">
                    {r.summary} {r.points.join(" ")}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>{study && <CaseModal key="modal" list={cases} study={study} onClose={close} onSelect={open} />}</AnimatePresence>
    </section>
  );
}
