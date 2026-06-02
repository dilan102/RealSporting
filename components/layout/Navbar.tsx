"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, UserRound, X } from "lucide-react";
import { club, navLinks } from "@/lib/content";
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
    const onScroll = () => setScrolled(window.scrollY > 24);
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

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const toggleAdmin = () => {
    window.dispatchEvent(new Event("cdrs-admin-toggle"));
  };

  const linkText = solidHeader ? "text-muted hover:text-text" : "nav-over-hero text-white/90 hover:text-white";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        solidHeader
          ? "border-border py-2.5 shadow-[0_12px_40px_rgba(5,14,9,0.08)]"
          : "border-transparent py-3"
      }`}
      style={{
        backgroundColor: solidHeader
          ? "var(--nav-bg)"
          : "color-mix(in srgb, var(--nav-bg) 16%, transparent)",
        backdropFilter: solidHeader ? "blur(18px)" : "blur(6px)",
      }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label={club.name}>
          <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/10 p-1 backdrop-blur">
            <Image
              src="/logo.png"
              alt="Logotipo Club Deportivo Real Sporting"
              width={38}
              height={38}
              className="object-contain"
              sizes="72px"
              priority
            />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span
              className={`block truncate text-sm font-black leading-none tracking-normal ${
                solidHeader ? "text-text" : "nav-over-hero text-white"
              }`}
            >
              Real Sporting
            </span>
            <span
              className={`mt-1 block text-[10px] font-black uppercase tracking-normal ${
                solidHeader ? "text-muted" : "nav-over-hero text-white/72"
              }`}
            >
              Usme
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative rounded-full px-3.5 py-2 text-sm font-bold transition-colors ${
                    active ? "text-accent" : linkText
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-x-3 -bottom-0.5 h-px bg-accent"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <NavWhatsAppLink className="btn-green alive-lift hidden min-h-10 items-center justify-center rounded-full px-4 text-sm font-black text-white md:inline-flex" />
          <Link
            href="/formulario-miembros-2026"
            className="btn-gold alive-lift hidden min-h-10 items-center justify-center rounded-full px-5 text-sm font-black md:inline-flex"
          >
            Inscribirme
          </Link>
          <button
            type="button"
            onClick={toggleAdmin}
            className={`relative z-[60] inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-sm ${
              adminActive
                ? "border-accent bg-accent text-[var(--button-text)]"
                : solidHeader
                  ? "border-border bg-bg-elevated text-muted hover:text-text"
                  : "border-white/20 bg-black/20 text-white backdrop-blur hover:border-white/40"
            }`}
            aria-label={adminActive ? "Abrir panel de administrador" : "Abrir modo administrador"}
            title={adminActive ? "Panel administrador" : "Modo administrador"}
          >
            <UserRound size={18} aria-hidden="true" />
          </button>
          <ThemeToggle />
          <button
            type="button"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border lg:hidden ${
              solidHeader
                ? "border-border bg-bg-elevated text-text"
                : "border-white/20 bg-black/20 text-white backdrop-blur"
            }`}
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mx-3 mt-3 overflow-hidden rounded-lg border border-border bg-bg-elevated/96 shadow-2xl backdrop-blur-2xl lg:hidden"
          >
            <ul className="grid gap-1 p-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-lg px-4 py-3 text-sm font-black ${
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
              <li className="grid gap-2 pt-2 sm:grid-cols-2">
                <NavWhatsAppLink className="btn-green alive-lift flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-black text-white" />
                <Link
                  href="/formulario-miembros-2026"
                  className="btn-gold alive-lift flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-black"
                  onClick={() => setOpen(false)}
                >
                  Inscribirme
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
