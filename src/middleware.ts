import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token;
    const rol = token?.user.rol;
    const pathname = req.nextUrl.pathname;

    if (rol === "User" && pathname.startsWith("/users")) {
      return NextResponse.redirect(new URL("/access-denied", req.url));
    }

    if (rol === "Admin" && pathname.startsWith("/users/")) {
      return NextResponse.redirect(new URL("/access-denied", req.url));
    }

    if (pathname.startsWith("/dashboard")) {
      return NextResponse.next();
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token?.user,
    },

    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: [
    "/tasks/:path*",
    "/users/:path*",
    "/dashboard/:path*",
    "/api/users/:path*",
  ],
};
