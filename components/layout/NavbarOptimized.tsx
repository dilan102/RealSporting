"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, UserRound, X } from "lucide-react";
import { club, navLinks } from "@/lib/content";
import { NavWhatsAppLink } from "@/components/layout/NavWhatsAppLink";
import { DayNightScrollIndicator } from "@/components/ui/DayNightScrollIndicator";

export function NavbarOptimized() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [adminActive, setAdminActive] = useState(false);
  const onHomeHero = pathname === "/" && !scrolled;
  const solidHeader = !onHomeHero;

  useEffect(() => {
    let rafId: number;
    
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
      });
    };
    
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const syncAdminAccess = () => {
      const hasPasswordAccess = Boolean(window.sessionStorage.getItem("cdrs-admin-key"));
      setAdminActive(hasPasswordAccess);
    };

    syncAdminAccess();
    window.addEventListener("cdrs-admin-login", syncAdminAccess);
    window.addEventListener("cdrs-admin-logout", syncAdminAccess);

    return () => {
      window.removeEventListener("cdrs-admin-login", syncAdminAccess);
      window.removeEventListener("cdrs-admin-logout", syncAdminAccess);
    };
  }, []);

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
  const isActiveLink = (href: string) =>
    href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
        solidHeader
          ? "border-border/80 py-2.5 shadow-[0_12px_40px_rgba(5,14,9,0.08)]"
          : "border-white/10 py-3"
      }`}
      style={{
        backgroundColor: solidHeader
          ? "var(--nav-bg)"
          : "color-mix(in srgb, var(--nav-bg) 16%, transparent)",
        backdropFilter: solidHeader ? "blur(18px)" : "blur(6px)",
      }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-4 lg:px-5">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5" aria-label={club.name}>
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

        {/* Desktop Menu - CSS only, no Framer Motion */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => {
            const active = isActiveLink(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`group relative block overflow-hidden rounded-full px-2.5 py-2 text-[13px] font-bold transition-colors duration-200 xl:px-3 xl:text-sm ${
                    active ? "text-accent" : linkText
                  }`}
                >
                  <span className="absolute inset-0 rounded-full bg-[color-mix(in_srgb,var(--accent-gold)_12%,transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative z-10">{link.label}</span>
                  <span className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-current opacity-45 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  {active && (
                    <span className="absolute inset-x-3 bottom-1 h-px bg-accent" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1.5">
          <NavWhatsAppLink className="btn-green alive-lift hidden min-h-10 items-center justify-center rounded-full px-3 text-[13px] font-black text-white md:inline-flex xl:px-4 xl:text-sm" />
          <Link
            href="/formulario-miembros-2026"
            className="btn-gold alive-lift hidden min-h-10 items-center justify-center rounded-full px-3.5 text-[13px] font-black md:inline-flex xl:px-5 xl:text-sm"
          >
            Inscribirme
          </Link>
          <button
            type="button"
            onClick={toggleAdmin}
            className={`relative z-[60] inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-colors ${
              adminActive
                ? "border-accent bg-accent text-[var(--button-text)]"
                : solidHeader
                  ? "border-border bg-bg-elevated text-muted hover:text-text"
                  : "border-white/20 bg-black/20 text-white backdrop-blur hover:border-white/40"
            }`}
            aria-label={adminActive ? "Abrir panel de administrador" : "Abrir modo administrador"}
            title={adminActive ? "Panel administrador" : "Modo administrador"}
          >
            {adminActive ? <UserRound size={18} /> : <UserRound size={18} />}
          </button>
          <DayNightScrollIndicator />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={`relative z-[60] inline-flex h-10 w-10 items-center justify-center rounded-full border lg:hidden ${
              solidHeader
                ? "border-border bg-bg-elevated"
                : "border-white/20 bg-black/20 backdrop-blur"
            }`}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Simple toggle, no animations */}
      {open && (
        <div className="border-t border-border/50 bg-bg-primary/95 backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <ul className="space-y-2">
              {navLinks.map((link) => {
                const active = isActiveLink(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block rounded-lg px-4 py-2.5 text-sm font-bold transition-colors ${
                        active
                          ? "bg-accent/15 text-accent"
                          : "text-text hover:bg-bg-elevated"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
