import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

const read = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(read);

  // Keep in sync if another component (or the pre-paint script) changes it.
  useEffect(() => {
    const mo = new MutationObserver(() => setTheme(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = read() === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode: ignore */
    }
  }, []);

  return { theme, toggle };
}
