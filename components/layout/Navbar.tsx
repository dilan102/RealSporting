"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { club, navLinks } from "@/lib/content";
import { NavWhatsAppLink } from "@/components/layout/NavWhatsAppLink";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
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

  const linkText = solidHeader ? "text-muted hover:text-text" : "text-white/90 hover:text-white";
  const isActiveLink = (href: string) =>
    href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
        solidHeader
          ? "border-border/80 py-2.5 shadow-sm"
          : "border-white/10 py-3"
      }`}
      style={{
        backgroundColor: solidHeader
          ? "var(--nav-bg)"
          : "color-mix(in srgb, var(--nav-bg) 12%, transparent)",
        backdropFilter: solidHeader ? "blur(18px)" : "blur(8px)",
      }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label={club.name}>
          <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/15 bg-white/8 p-1.5 backdrop-blur">
            <Image
              src="/logo.png"
              alt="Logotipo Real Sporting"
              width={32}
              height={32}
              className="object-contain"
              sizes="64px"
              priority
            />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span
              className={`block truncate text-sm font-black leading-none tracking-tight ${
                solidHeader ? "text-text" : "text-white"
              }`}
            >
              Real Sporting
            </span>
            <span
              className={`mt-0.5 block text-[10px] font-bold uppercase tracking-wider ${
                solidHeader ? "text-muted" : "text-white/70"
              }`}
            >
              Usme
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = isActiveLink(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`group relative block rounded-lg px-3 py-2 text-sm font-bold transition-colors duration-200 ${
                    active ? "text-accent" : linkText
                  }`}
                >
                  <span className="absolute inset-0 rounded-lg bg-accent/0 transition-colors duration-200 group-hover:bg-accent/10" />
                  <span className="relative z-10">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <NavWhatsAppLink className="btn-green alive-lift hidden min-h-10 items-center justify-center rounded-lg px-4 text-sm font-bold text-white md:inline-flex" />
          <Link
            href="/formulario-miembros-2026"
            className="btn-gold alive-lift hidden min-h-10 items-center justify-center rounded-lg px-4 text-sm font-bold md:inline-flex"
          >
            Inscribirme
          </Link>
          <button
            type="button"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors duration-200 lg:hidden ${
              solidHeader
                ? "border-border bg-bg-elevated text-text"
                : "border-white/20 bg-white/8 text-white backdrop-blur"
            }`}
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t lg:hidden transition-all duration-300 ${
          open ? "max-h-80" : "max-h-0"
        } ${solidHeader ? "border-border" : "border-white/10"}`}
      >
        <ul className="grid gap-1 px-4 py-3 sm:px-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                  isActiveLink(link.href)
                    ? "bg-accent/10 text-accent"
                    : "text-text/80 hover:bg-surface hover:text-text"
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="grid grid-cols-2 gap-2 pt-3">
            <NavWhatsAppLink className="btn-green alive-lift flex min-h-10 items-center justify-center rounded-lg px-3 text-xs font-bold text-white sm:text-sm" />
            <Link
              href="/formulario-miembros-2026"
              className="btn-gold alive-lift flex min-h-10 items-center justify-center rounded-lg px-3 text-xs font-bold sm:text-sm"
              onClick={() => setOpen(false)}
            >
              Inscribirme
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
