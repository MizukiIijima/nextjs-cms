import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "admin_session";

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
