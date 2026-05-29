import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const { pathname } = req.nextUrl;

      if (pathname === "/admin/login" || pathname.startsWith("/admin/error")) {
        return true;
      }

      if (pathname.startsWith("/admin")) {
        return Boolean(token?.isAdmin);
      }

      return true;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/error",
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
