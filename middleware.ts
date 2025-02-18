import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "@/routes";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "./lib/auth.config";
const { auth } = NextAuth(authConfig);

const allow_origin_lists = ["https://yourwebsite.fr", "http://localhost:3000"];

const isDevelopment = process.env.NODE_ENV === "development";

export default auth((req) => {
  const { nextUrl } = req;
  const LOGGED_IN = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoutes = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoutes) {
    if (LOGGED_IN) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isPublicRoute && !LOGGED_IN) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const origin = req.headers.get("origin");

  if (origin && !allow_origin_lists.includes(origin)) {
    return new NextResponse(null, {
      status: 403,
      statusText: "Forbidden",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Créer une nouvelle instance de Headers
  const requestHeaders = new Headers(req.headers);
  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Ajouter les headers CORS
  appendCorsHeaders(res.headers, origin);

  // Ajouter les headers CSP
  appendCspHeaders(res.headers);

  return res;
});

function appendCorsHeaders(headers: Headers, origin: string | null) {
  if (origin) {
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    headers.set(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Content-Type, Content-Length, Content-MDS, Accept, Accept-Version, Date, X-Api-Version"
    );
  }
}

function appendCspHeaders(headers: Headers) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const policy = isDevelopment
    ? `
      default-src 'self';
      script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'nonce-${nonce}' 'unsafe-inline';
      img-src 'self' blob: data:;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `
    : `
      default-src 'self';
      script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://yourwebsite.fr;
      style-src 'self' 'nonce-${nonce}' https://yourwebsite.fr;
      img-src 'self' blob: data:;
      font-src 'self' https://yourwebsite.fr;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
      connect-src 'self' https:;
    `;

  headers.set("Content-Security-Policy", policy.replace(/\s{2,}/g, " ").trim());
  headers.set("x-nonce", nonce);
}
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
