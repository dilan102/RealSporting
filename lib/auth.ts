import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

function getAllowedAdminEmails(): string[] {
  return (process.env.GITHUB_ADMIN_USERS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function isAllowedAdminEmail(email?: string | null) {
  const allowed = getAllowedAdminEmails();

  if (!email) {
    return false;
  }

  // Si no hay emails configurados, denegar acceso por seguridad
  if (allowed.length === 0) {
    return false;
  }

  return allowed.includes(email.trim().toLowerCase());
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/error",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "github") {
        return true;
      }

      if (!isAllowedAdminEmail(user.email)) {
        return "/admin/error?error=AccessDenied";
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user && account?.provider === "github") {
        token.isAdmin = isAllowedAdminEmail(user.email);
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = Boolean(token.isAdmin);
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
