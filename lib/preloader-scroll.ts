const HASH_KEY = "cdrs-restore-hash";
const SECTION_KEY = "cdrs-restore-section";

export function saveScrollTargetBeforeUnload() {
  if (typeof window === "undefined") {
    return;
  }

  const { pathname, hash } = window.location;

  if (pathname !== "/" && pathname !== "") {
    return;
  }

  try {
    if (hash) {
      sessionStorage.setItem(HASH_KEY, hash);
      sessionStorage.removeItem(SECTION_KEY);
      return;
    }

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[id], main [id]"),
    );

    let bestId: string | null = null;
    let bestScore = Number.POSITIVE_INFINITY;

    for (const section of sections) {
      if (!section.id) {
        continue;
      }

      const rect = section.getBoundingClientRect();
      const distanceFromTop = Math.abs(rect.top - 96);

      if (rect.top < window.innerHeight * 0.55 && rect.bottom > 120) {
        if (distanceFromTop < bestScore) {
          bestScore = distanceFromTop;
          bestId = section.id;
        }
      }
    }

    if (bestId) {
      sessionStorage.setItem(SECTION_KEY, bestId);
      sessionStorage.removeItem(HASH_KEY);
    } else {
      sessionStorage.removeItem(SECTION_KEY);
      sessionStorage.removeItem(HASH_KEY);
    }
  } catch {
    // sessionStorage unavailable
  }
}

export function restoreScrollTargetAfterPreloader() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const storedHash = sessionStorage.getItem(HASH_KEY);
    const storedSection = sessionStorage.getItem(SECTION_KEY);
    sessionStorage.removeItem(HASH_KEY);
    sessionStorage.removeItem(SECTION_KEY);

    const hash = storedHash || window.location.hash;

    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }
    }

    if (storedSection) {
      const section = document.getElementById(storedSection);
      if (section) {
        section.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  } catch {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }
}

export function clearPreloaderScrollState() {
  try {
    sessionStorage.removeItem(HASH_KEY);
    sessionStorage.removeItem(SECTION_KEY);
  } catch {
    // ignore
  }
}
