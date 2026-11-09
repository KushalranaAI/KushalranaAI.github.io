import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/**
 * A soft follower ring that grows over links and shows a label for elements with data-cursor="…".
 * Only mounts for fine pointers (mouse / trackpad); touch devices keep their normal behaviour.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 420, damping: 34, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 420, damping: 34, mass: 0.35 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const tagged = t?.closest<HTMLElement>("[data-cursor]");
      setLabel(tagged?.dataset.cursor ?? "");
      setHover(Boolean(t?.closest("a, button, [role='tab'], [data-cursor]")));
    };
    const dn = () => setDown(true);
    const up = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", dn);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", dn);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y }} aria-hidden="true" />
      <motion.div
        className={`cursor-ring${hover ? " is-hover" : ""}${label ? " has-label" : ""}${down ? " is-down" : ""}`}
        style={{ x: sx, y: sy }}
        aria-hidden="true"
      >
        <span>{label}</span>
      </motion.div>
    </>
  );
}
