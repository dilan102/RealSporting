"use client";

import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className="page-transition"
      style={{
        animation: "fadeIn 0.2s ease-in-out",
      }}
    >
      {children}
    </div>
  );
}
