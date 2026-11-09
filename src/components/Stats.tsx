import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { stats, type Stat } from "../data/profile";
import { Reveal } from "./Reveal";

function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? stat.value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, stat.value, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduce, stat.value]);

  return (
    <b ref={ref} aria-label={`${stat.prefix ?? ""}${stat.value}${stat.suffix ?? ""}`}>
      <span aria-hidden="true">
        {stat.prefix}
        {n}
        {stat.suffix}
      </span>
    </b>
  );
}

export function Stats() {
  return (
    <section className="stats-band" aria-label="Highlights">
      <ul className="stats">
        {stats.map((s, i) => (
          <li key={s.label}>
            <Reveal delay={i * 0.08} y={20}>
              <Counter stat={s} />
              <span>{s.label}</span>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
