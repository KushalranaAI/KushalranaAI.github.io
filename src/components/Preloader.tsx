import { AnimatePresence, animate, motion } from "motion/react";
import { useEffect, useState } from "react";
import { profile } from "../data/profile";

const KEY = "intro-seen";

/** Short name-and-counter intro. Shown once per browser session; skipped for reduced motion. */
export function shouldIntro(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(KEY) !== "1";
  } catch {
    return true;
  }
}

export function Preloader({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: 1.5,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        try {
          sessionStorage.setItem(KEY, "1");
        } catch {
          /* ignore */
        }
        setVisible(false);
      },
    });
    return () => controls.stop();
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          className="preloader"
          role="status"
          aria-label="Loading"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="preloader-inner">
            <p className="preloader-name">
              {profile.first} <em>{profile.last}</em>
            </p>
            <p className="preloader-role">{profile.role}</p>
          </div>
          <span className="preloader-count" aria-hidden="true">
            {String(count).padStart(3, "0")}
          </span>
          <motion.span className="preloader-bar" style={{ scaleX: count / 100 }} aria-hidden="true" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
