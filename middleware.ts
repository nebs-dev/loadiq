import { authkitMiddleware } from "@workos-inc/authkit-nextjs";
import { NextResponse } from "next/server";
import { e2eEnabled } from "./lib/e2e-mode";
import type { NextFetchEvent, NextRequest } from "next/server";

export default function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  if (
    e2eEnabled() &&
    ["127.0.0.1", "localhost"].includes(request.nextUrl.hostname)
  )
    return NextResponse.next();
  return authkitMiddleware({
    redirectUri:
      process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI ??
      new URL("/callback", request.nextUrl.origin).toString(),
  })(request, event);
}

export const config = {
  matcher: ["/app/:path*", "/callback", "/signin", "/signup"],
};
