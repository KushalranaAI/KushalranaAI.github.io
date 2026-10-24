// Small progressive enhancements. The page is fully readable without JavaScript.
(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("js");

  const store = {
    get(key) {
      try { return localStorage.getItem(key); } catch (e) { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch (e) { /* private mode: ignore */ }
    },
  };

  // Theme toggle
  document.getElementById("theme-toggle")?.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    store.set("theme", next);
  });

  // Mobile menu
  const menuBtn = document.getElementById("menu-btn");
  const links = document.getElementById("nav-links");
  const closeMenu = () => {
    links.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  };
  menuBtn?.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  links?.addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  // Header border once the page scrolls
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Highlight the nav link of the section in view
  const navLinks = [...document.querySelectorAll(".nav-links a")];
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
      }
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  // Reveal-on-scroll
  const revealables = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      }
    }, { rootMargin: "0px 0px -8% 0px" });
    revealables.forEach((el) => io.observe(el));
  }

  // Project filters (feature cards and the "earlier projects" list)
  const filterButtons = document.querySelectorAll(".filter");
  const filterables = document.querySelectorAll("#project-grid .project, #earlier-grid .mini");
  const emptyNote = document.getElementById("empty-note");
  filterButtons.forEach((btn) => btn.addEventListener("click", () => {
    const tag = btn.dataset.filter;
    filterButtons.forEach((b) => {
      b.classList.toggle("active", b === btn);
      b.setAttribute("aria-pressed", String(b === btn));
    });
    let shown = 0;
    filterables.forEach((el) => {
      const match = tag === "all" || el.dataset.tags.split(" ").includes(tag);
      el.classList.toggle("is-hidden", !match);
      if (match) { el.classList.add("in"); shown++; }
    });
    emptyNote.hidden = shown > 0;
  }));

  // Copy email
  const copyBtn = document.getElementById("copy-email");
  copyBtn?.addEventListener("click", async () => {
    const label = copyBtn.querySelector("span");
    try {
      await navigator.clipboard.writeText(copyBtn.dataset.email);
      label.textContent = "Copied!";
    } catch (e) {
      label.textContent = copyBtn.dataset.email;
    }
    setTimeout(() => { label.textContent = "Copy email"; }, 2000);
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
