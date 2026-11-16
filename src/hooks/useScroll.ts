/** Native page scrolling: jump to a section, and freeze the page behind a menu or panel. */
const api = {
  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    // Sections far from the screen are skipped by the browser and sized by estimate (see .section in sections.css).
    // Lay them all out before the first jump so it lands exactly; by now the first paint is long done.
    document.documentElement.classList.add("all-rendered");
    el.scrollIntoView({ behavior, block: "start" });
  },
  lock() {
    document.documentElement.style.overflow = "hidden";
  },
  unlock() {
    document.documentElement.style.overflow = "";
  },
};

export const useScroll = () => api;
