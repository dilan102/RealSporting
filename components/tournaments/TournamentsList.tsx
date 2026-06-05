"use client";

import { useEffect, useState } from "react";
import type { Tournament } from "@/lib/tournament-store";
import { TournamentCard } from "./TournamentCard";
import { TournamentEditModal } from "./TournamentEditModal";

export function TournamentsList({
  items,
  sectionTitle,
  sectionDescription,
}: {
  items: Tournament[];
  sectionTitle: string;
  sectionDescription: string;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [accessKey, setAccessKey] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const syncAdminAccess = () => {
      const key = window.sessionStorage.getItem("cdrs-admin-key") || "";

      setAccessKey(key);
      setUnlocked(Boolean(key));
    };

    syncAdminAccess();
    window.addEventListener("cdrs-admin-login", syncAdminAccess);
    window.addEventListener("cdrs-admin-logout", syncAdminAccess);

    return () => {
      window.removeEventListener("cdrs-admin-login", syncAdminAccess);
      window.removeEventListener("cdrs-admin-logout", syncAdminAccess);
    };
  }, []);

  const editingItem = items.find((item) => item.id === editingId) || null;

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-bg-elevated p-6 text-center">
        <p className="text-sm font-semibold text-text">No hay publicaciones en esta sección todavía.</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Cuando el administrador suba programación de esta categoría, aparecerá aquí.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <TournamentCard
            key={item.id}
            item={item}
            canManage={unlocked}
            onEdit={() => setEditingId(item.id)}
            onDelete={() => setEditingId(item.id)}
          />
        ))}
      </div>

      <TournamentEditModal
        item={editingItem}
        isOpen={editingId !== null}
        onClose={() => setEditingId(null)}
        onSuccess={() => {
          setEditingId(null);
        }}
        accessKey={accessKey}
      />
    </>
  );
}
