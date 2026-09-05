import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { isLegacyConsumerPath, isPublicAppPath } from "@/lib/auth/routes";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (isLegacyConsumerPath(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (process.env.NEXT_PUBLIC_APP_MODE !== "production" || (isPublicAppPath(pathname) && pathname !== "/login")) {
    return NextResponse.next();
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return pathname === "/login" ? NextResponse.next() : NextResponse.redirect(new URL("/login", request.url));

  let response = NextResponse.next({ request });
  const client = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (items) => {
        items.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        items.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await client.auth.getUser();
  if (!user) return pathname === "/login" ? response : NextResponse.redirect(new URL("/login", request.url));
  if (pathname === "/login") return NextResponse.redirect(new URL("/overview", request.url));
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
