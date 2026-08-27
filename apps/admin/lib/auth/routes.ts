export function isPublicAppPath(pathname: string): boolean {
  return pathname === "/" || pathname === "/login" || pathname === "/app" || pathname.startsWith("/app/");
}
