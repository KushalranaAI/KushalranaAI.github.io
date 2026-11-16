import { useLayoutEffect, useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Fades and lifts its children in the first time they scroll on screen. Anything already on screen when the page
 * loads is left alone, so the prerendered HTML never flickers. Plain CSS transition, no animation library.
 */
export function Reveal({ children, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = el.closest("section");
    const offscreen = (node: Element) => node.getBoundingClientRect().top >= window.innerHeight;
    if (!(section ? offscreen(section) : false) && !offscreen(el)) return;
    el.classList.add("reveal-wait");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.classList.remove("reveal-wait");
        io.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal${className ? ` ${className}` : ""}`} style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      {children}
    </div>
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
