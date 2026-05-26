"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, UserRound, X } from "lucide-react";
import { club, navLinks } from "@/lib/content";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [adminActive, setAdminActive] = useState(false);

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
      setAdminActive(Boolean(window.sessionStorage.getItem("cdrs-admin-key")));
    };

    syncAdminAccess();
    window.addEventListener("cdrs-admin-login", syncAdminAccess);
    window.addEventListener("cdrs-admin-logout", syncAdminAccess);

    return () => {
      window.removeEventListener("cdrs-admin-login", syncAdminAccess);
      window.removeEventListener("cdrs-admin-logout", syncAdminAccess);
    };
  }, []);

  const toggleAdmin = () => {
    window.dispatchEvent(new Event("cdrs-admin-toggle"));
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b py-2.5 sm:py-3"
          : "border-b border-border bg-bg/85 py-3 text-text backdrop-blur-xl sm:py-4"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/logo.png"
            alt={`Logo ${club.name}`}
            width={44}
            height={44}
            className="size-10 object-contain sm:size-11"
          />
          <span className="hidden text-sm font-semibold tracking-tight sm:block">
            <span className="text-gradient">
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
                      : scrolled
                        ? "text-muted hover:text-text"
                        : "text-muted hover:text-text"
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
          <button
            type="button"
            onClick={toggleAdmin}
            className={`relative z-[60] inline-flex h-10 w-10 items-center justify-center rounded-lg border shadow-sm transition-colors ${
              adminActive
                ? "border-accent bg-accent text-bg hover:bg-accent/90"
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
            className="glass rounded-full p-2.5 shadow-sm md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
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
            className="mx-3 mt-2 overflow-hidden rounded-[1.75rem] border border-border bg-bg-elevated/92 shadow-2xl backdrop-blur-2xl md:hidden"
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
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
