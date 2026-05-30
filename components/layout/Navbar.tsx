"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { UserRound } from "lucide-react";
import { club, navLinks } from "@/lib/content";
import { RegistrationModal } from "@/components/contact/RegistrationModal";
import { NavWhatsAppLink } from "@/components/layout/NavWhatsAppLink";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [adminActive, setAdminActive] = useState(false);
  const onHomeHero = pathname === "/" && !scrolled;
  const solidHeader = !onHomeHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const syncAdminAccess = () => {
      const hasPasswordAccess = Boolean(window.sessionStorage.getItem("cdrs-admin-key"));
      const hasGitHubAccess = Boolean(session?.user?.isAdmin);
      setAdminActive(hasPasswordAccess || hasGitHubAccess);
    };

    syncAdminAccess();
    window.addEventListener("cdrs-admin-login", syncAdminAccess);
    window.addEventListener("cdrs-admin-logout", syncAdminAccess);

    return () => {
      window.removeEventListener("cdrs-admin-login", syncAdminAccess);
      window.removeEventListener("cdrs-admin-logout", syncAdminAccess);
    };
  }, [session?.user?.isAdmin]);

  const toggleAdmin = () => {
    window.dispatchEvent(new Event("cdrs-admin-toggle"));
  };

  return (
    <header
      className={`sticky inset-x-0 top-0 z-50 border-b transition-all duration-500 ${
        solidHeader
          ? "border-border py-2.5 shadow-lg shadow-black/10 backdrop-blur-xl sm:py-3"
          : "border-transparent bg-transparent py-3 text-text backdrop-blur-0 sm:py-4"
      }`}
      style={{
        backgroundColor: solidHeader
          ? "var(--nav-bg)"
          : "color-mix(in srgb, var(--nav-bg) 35%, transparent)",
        backdropFilter: solidHeader ? "blur(14px)" : "blur(4px)",
        opacity: solidHeader ? 1 : 0.98,
      }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label={club.name}>
          <Image
            src="/logo.png"
            alt="Logotipo Club Deportivo Real Sporting"
            width={44}
            height={44}
            className="size-10 object-contain sm:size-11"
            sizes="96px"
          />
          <span className="hidden text-sm font-semibold tracking-tight sm:block">
            <span className={onHomeHero ? "nav-over-hero text-white" : "text-gradient"}>
              {club.name}
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "text-accent"
                      : solidHeader
                        ? "text-muted hover:text-text"
                        : "nav-over-hero text-white/90 hover:text-white"
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-2 -bottom-0.5 h-px bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <NavWhatsAppLink className="btn-green hidden min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-black text-white md:inline-flex lg:px-4" />
          <RegistrationModal
            className="btn-gold hidden min-h-10 items-center justify-center rounded-lg px-4 text-sm font-black md:inline-flex"
          >
            Inscríbete
          </RegistrationModal>
          <button
            type="button"
            onClick={toggleAdmin}
            className={`relative z-[60] inline-flex h-10 w-10 items-center justify-center rounded-lg border shadow-sm transition-colors ${
              adminActive
                ? "border-accent bg-accent text-[var(--button-text)] hover:bg-accent/90"
                : "border-border bg-bg-elevated text-muted hover:border-accent/40 hover:text-text"
            }`}
            aria-label={adminActive ? "Abrir panel de administrador" : "Abrir modo administrador"}
            title={adminActive ? "Panel administrador" : "Modo administrador"}
          >
            <UserRound size={18} aria-hidden="true" />
          </button>
          <ThemeToggle />
          <button
            type="button"
            className="glass relative rounded-lg p-2.5 shadow-sm md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            <span className="relative block h-5 w-6">
              <span
                className={`absolute left-0 top-0 h-0.5 w-6 bg-current transition-all duration-300 ${open ? "translate-y-[9px] rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-[9px] h-0.5 w-6 bg-current transition-all duration-300 ${open ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute left-0 top-[18px] h-0.5 w-6 bg-current transition-all duration-300 ${open ? "-translate-y-[9px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mx-3 mt-2 overflow-hidden rounded-lg border border-border bg-bg-elevated/92 shadow-2xl backdrop-blur-2xl md:hidden"
          >
            <ul className="flex flex-col gap-1 p-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-full px-4 py-3 text-sm font-bold transition-colors ${
                      pathname === link.href
                        ? "bg-accent/10 text-accent"
                        : "text-muted hover:bg-surface hover:text-text"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <NavWhatsAppLink className="btn-green mt-1 flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black text-white" />
              </li>
              <li>
                <RegistrationModal
                  className="btn-gold mt-1 flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-black"
                >
                  Inscríbete
                </RegistrationModal>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
