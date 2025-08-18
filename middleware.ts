import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

const { auth: middleware } = NextAuth(authConfig);

// Rutas públicas
const publicRouter = [
  "/",
  "/profiler",
  "/asistenteia",
  "/forgot-password",
  "/reset-password",
  "/api/auth",
  "/api/auth/session",
  "/api/auth/providers",
  "/api/auth/csrf",
  "/api/auth/signin/google",
  "/api/auth/reset-password",
  "/api/auth/callback/google",
  "/api/stripe",
];

// Rutas privadas
export default middleware((req) => {
  const { nextUrl, auth } = req;

  const isLoggedIn = !!auth?.user;

  // Proteger las rutas que necesitan autenticación
  if (!publicRouter.includes(nextUrl.pathname) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
