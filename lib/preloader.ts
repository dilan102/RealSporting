const INITIAL_PATH_KEY = "cdrs-initial-path";
const COMPLETED_KEY = "cdrs-preloader-completed";

export function isHomePath(pathname: string) {
  return pathname === "/" || pathname === "";
}

function getNavigationEntry(): PerformanceNavigationTiming | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  return performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
}

function isReloadNavigation(): boolean {
  const nav = getNavigationEntry();

  if (nav?.type === "reload") {
    return true;
  }

  const legacy = performance as Performance & {
    navigation?: { type?: number };
  };

  return legacy.navigation?.type === 1;
}

function ensureInitialPathRecorded() {
  try {
    if (!sessionStorage.getItem(INITIAL_PATH_KEY)) {
      sessionStorage.setItem(INITIAL_PATH_KEY, window.location.pathname);
    }
  } catch {
    // sessionStorage unavailable
  }
}

/**
 * Muestra el preloader en:
 * - Primera carga directa de `/` (navigate)
 * - Recarga F5 en `/` (reload)
 * No lo muestra al volver a Inicio por navegación interna (Link).
 */
export function shouldShowHomePreloader(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (!isHomePath(window.location.pathname)) {
    return false;
  }

  if (isReloadNavigation()) {
    return true;
  }

  ensureInitialPathRecorded();

  try {
    const nav = getNavigationEntry();
    const initialPath = sessionStorage.getItem(INITIAL_PATH_KEY);
    const completed = sessionStorage.getItem(COMPLETED_KEY);

    return (
      nav?.type === "navigate" &&
      initialPath === "/" &&
      completed !== "1"
    );
  } catch {
    return false;
  }
}

export function markPreloaderCompleted() {
  try {
    sessionStorage.setItem(COMPLETED_KEY, "1");
  } catch {
    // ignore
  }
}

export function setPreloaderPending(active: boolean) {
  document.documentElement.classList.toggle("preloader-pending", active);
  document.documentElement.classList.toggle("preloader-active", active);
}

export const PRELOADER_CRITICAL_CSS = `
html.preloader-pending {
  overflow: hidden !important;
  background: #EAF4ED !important;
}
html[data-theme="dark"].preloader-pending {
  background: #0A0A0A !important;
}
html.preloader-pending #site-content {
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}
html.preloader-pending::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 99998;
  background: inherit;
}
html.preloader-active .site-preloader-root {
  visibility: visible !important;
  opacity: 1 !important;
}
`;

export const PRELOADER_BOOT_SCRIPT = `
(function () {
  try {
    var path = location.pathname;
    if (path !== "/" && path !== "") return;

    var nav = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
    var isReload = nav && nav.type === "reload";
    if (!isReload && performance.navigation && performance.navigation.type === 1) {
      isReload = true;
    }

    if (!sessionStorage.getItem("cdrs-initial-path")) {
      sessionStorage.setItem("cdrs-initial-path", path);
    }

    var initialPath = sessionStorage.getItem("cdrs-initial-path");
    var completed = sessionStorage.getItem("cdrs-preloader-completed");
    var firstHomeVisit = nav && nav.type === "navigate" && path === "/" && initialPath === "/" && completed !== "1";
    var shouldShow = isReload || firstHomeVisit;

    if (!shouldShow) return;

    var theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }

    document.documentElement.classList.add("preloader-pending", "preloader-active");
  } catch (e) {}
})();
`;

export const LOADER_DURATION_MS = 4300;
export const LOADER_EXIT_MS = 1300;

/** Curva suave tipo “cinematic ease-out”. */
export const PRELOADER_EASE = [0.22, 1, 0.36, 1] as const;
