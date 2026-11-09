import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/** Fades and lifts its children into view once, the first time they scroll on screen. */
export function Reveal({ children, delay = 0, y = 28, className }: Props) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Slides each character up out of a mask. Used for big headings. */
export function SplitLine({
  text,
  className,
  delay = 0,
  play = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  play?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <span className={`split ${className ?? ""}`}>
      <span className="sr-only">{text}</span>
      {[...text].map((ch, i) => (
        <span className="split-mask" aria-hidden="true" key={i}>
          <motion.span
            className="split-char"
            initial={reduce ? false : { y: "115%", rotate: 6 }}
            animate={play ? { y: "0%", rotate: 0 } : undefined}
            transition={{ duration: 0.9, delay: delay + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Turns **bold** markers in data strings into <b> elements. */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((part, i) => (i % 2 ? <b key={i}>{part}</b> : <span key={i}>{part}</span>))}
    </>
  );
}
