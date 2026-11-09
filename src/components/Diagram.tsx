import { motion, useReducedMotion } from "motion/react";
import type { Diagram as DiagramData } from "../data/cases";

const ease = [0.22, 1, 0.36, 1] as const;

/** Animated architecture diagram: nodes pop in row by row and the connectors carry a travelling pulse. */
export function Diagram({ data }: { data: DiagramData }) {
  const reduce = useReducedMotion();

  if (data.kind === "trace") {
    return (
      <figure className="diagram">
        <div className="trace" role="img" aria-label={data.caption}>
          <div className="trace-head">
            <span>{data.head[0]}</span>
            <span>{data.head[1]}</span>
          </div>
          {data.spans.map((s, i) => (
            <div className="span-row" key={s.label}>
              <motion.div
                className={`span${s.tool ? " tool" : ""}`}
                style={{ marginLeft: `${s.start}%`, width: `${s.width}%`, transformOrigin: "left center" }}
                initial={reduce ? false : { scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease }}
              >
                <b>{s.label}</b>
              </motion.div>
            </div>
          ))}
          <div className="trace-foot">
            {data.foot.map((f, i) => (
              <span key={f} className={i === data.foot.length - 1 ? "okc" : ""}>
                {f}
              </span>
            ))}
          </div>
        </div>
        <figcaption>{data.caption}</figcaption>
      </figure>
    );
  }

  return (
    <figure className="diagram">
      <div className="flow" role="img" aria-label={data.caption}>
        {data.rows.map((row, r) => (
          <div className="flow-step" key={r}>
            {r > 0 && (
              <motion.span
                className="flow-link"
                aria-hidden="true"
                initial={reduce ? false : { scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: r * 0.28 - 0.1, ease }}
              />
            )}
            <div className={`flow-row${row.boundary ? " has-boundary" : ""}`}>
              {row.boundary && <span className="flow-boundary-label">{row.boundary}</span>}
              {row.nodes.map((n, i) => (
                <motion.div
                  key={n.label}
                  className={`node tone-${n.tone ?? "plain"}`}
                  initial={reduce ? false : { opacity: 0, y: 14, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.55, delay: r * 0.28 + i * 0.07, ease }}
                >
                  <b>{n.label}</b>
                  {n.sub && <small>{n.sub}</small>}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <figcaption>{data.caption}</figcaption>
    </figure>
  );
}
