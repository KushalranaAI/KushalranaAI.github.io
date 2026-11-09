import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

interface ScrollApi {
  scrollTo: (id: string) => void;
  lock: () => void;
  unlock: () => void;
}

const noop: ScrollApi = { scrollTo: () => {}, lock: () => {}, unlock: () => {} };
const Ctx = createContext<ScrollApi>(noop);

export const useScroll = () => useContext(Ctx);

/** Smooth scrolling (Lenis). Falls back to native scrolling when the visitor prefers reduced motion. */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    lenisRef.current = lenis;
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const api = useMemo<ScrollApi>(
    () => ({
      scrollTo: (id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const lenis = lenisRef.current;
        if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.3 });
        else el.scrollIntoView({ behavior: "auto", block: "start" });
      },
      lock: () => lenisRef.current?.stop(),
      unlock: () => lenisRef.current?.start(),
    }),
    [],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
