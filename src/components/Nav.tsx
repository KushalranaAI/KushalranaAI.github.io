import { AnimatePresence, motion, useScroll as useViewportScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { nav, profile } from "../data/profile";
import { useScroll } from "../hooks/useLenis";
import { useTheme } from "../hooks/useTheme";
import { Icon } from "./Icon";

export function Nav({ ready }: { ready: boolean }) {
  const { scrollTo, lock, unlock } = useScroll();
  const { theme, toggle } = useTheme();
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useViewportScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  // Which section is in view
  useEffect(() => {
    const els = nav.map((n) => document.getElementById(n.id)).filter((e): e is HTMLElement => Boolean(e));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((e) => io.observe(e));
    const hero = document.getElementById("top");
    const clear = new IntersectionObserver(([e]) => e?.isIntersecting && setActive(""), { threshold: 0.5 });
    if (hero) clear.observe(hero);
    return () => {
      io.disconnect();
      clear.disconnect();
    };
  }, []);

  // Mobile menu: lock the page behind it and close on Escape
  useEffect(() => {
    if (!open) return;
    lock();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      unlock();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lock, unlock]);

  const go = (id: string) => {
    setOpen(false);
    // Wait a tick so the menu's scroll lock is released before scrolling.
    setTimeout(() => scrollTo(id), 30);
  };

  return (
    <>
      <motion.div className="progress" style={{ scaleX: progress }} aria-hidden="true" />
      <motion.header
        className="nav-wrap"
        initial={{ y: -80, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : undefined}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="nav" aria-label="Main">
          <a
            className="brand"
            href="#top"
            aria-label={`${profile.name}, back to top`}
            onClick={(e) => {
              e.preventDefault();
              scrollTo("top");
            }}
          >
            <span className="brand-mark">KR</span>
            <span className="brand-name">{profile.name}</span>
          </a>

          <ul className="nav-links">
            {nav.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className={active === n.id ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    go(n.id);
                  }}
                >
                  {active === n.id && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  <span>{n.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button className="icon-btn" type="button" onClick={toggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
              <Icon name={theme === "dark" ? "sun" : "moon"} />
            </button>
            <a className="btn btn-small btn-ghost nav-resume" href={profile.resume} target="_blank" rel="noopener">
              Résumé
            </a>
            <button
              className="icon-btn menu-btn"
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <Icon name={open ? "close" : "menu"} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul>
              {nav.map((n, i) => (
                <motion.li key={n.id} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                  <a href={`#${n.id}`} onClick={(e) => { e.preventDefault(); go(n.id); }}>
                    <small>{String(i + 1).padStart(2, "0")}</small>
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a className="btn btn-primary" href={profile.resume} target="_blank" rel="noopener">
              <Icon name="download" /> Résumé
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
