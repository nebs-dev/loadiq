import { authkitMiddleware } from "@workos-inc/authkit-nextjs";
import type { NextFetchEvent, NextRequest } from "next/server";

export default function middleware(request: NextRequest, event: NextFetchEvent) {
  return authkitMiddleware({
    redirectUri:
      process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI ??
      new URL("/callback", request.nextUrl.origin).toString(),
  })(request, event);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
