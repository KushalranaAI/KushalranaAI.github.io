import { useCallback, useEffect, useState } from "react";

/**
 * Which case study is open, mirrored to the URL as `#case-<id>` so a case study can be linked to directly.
 * `ids` must be a stable list; a hash that names another section's case is ignored.
 */
export function useCaseHash(ids: string[], sectionId: string): [string | null, (id: string | null) => void] {
  const [openId, setOpenId] = useState<string | null>(null);

  // Arriving on a deep link: open the case study and put its section behind the panel.
  // Read in an effect, not during render, because the page is also rendered at build time where there is no URL.
  useEffect(() => {
    const id = window.location.hash.replace(/^#case-/, "");
    if (!ids.includes(id)) return;
    setOpenId(id);
    document.getElementById(sectionId)?.scrollIntoView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = useCallback((id: string | null) => {
    setOpenId(id);
    history.replaceState(null, "", id ? `#case-${id}` : window.location.pathname + window.location.search);
  }, []);

  return [openId, set];
}
