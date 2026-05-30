/** Solo recarga dura (F5) en la página de inicio — no navegación interna con Link. */
export function isHomePath(pathname: string) {
  return pathname === "/" || pathname === "";
}

export function isHardReloadOnHome(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (!isHomePath(window.location.pathname)) {
    return false;
  }

  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;

  if (nav?.type === "reload") {
    return true;
  }

  const legacy = performance as Performance & {
    navigation?: { type?: number };
  };

  return legacy.navigation?.type === 1;
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
    if (!isReload) return;

    var theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }

    document.documentElement.classList.add("preloader-pending", "preloader-active");
  } catch (e) {}
})();
`;

export const LOADER_DURATION_MS = 4000;
export const LOADER_EXIT_MS = 1100;
