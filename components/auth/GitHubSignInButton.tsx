"use client";

import { signIn } from "next-auth/react";
import { Github } from "lucide-react";
import { useState } from "react";

type GitHubSignInButtonProps = {
  callbackUrl?: string;
  className?: string;
  label?: string;
};

export function GitHubSignInButton({
  callbackUrl = "/",
  className = "",
  label = "Iniciar sesión con GitHub",
}: GitHubSignInButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signIn("github", { callbackUrl });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={loading}
      className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-border bg-bg px-5 text-sm font-black text-text transition-colors hover:border-accent hover:bg-bg-elevated disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      aria-label="Iniciar sesión con GitHub para administrar el sitio"
    >
      <Github size={18} aria-hidden="true" />
      {loading ? "Conectando con GitHub..." : label}
    </button>
  );
}
