export function isPublicAppPath(pathname: string): boolean {
  return pathname === "/" || pathname === "/login";
}

export function isLegacyConsumerPath(pathname: string): boolean {
  return pathname === "/app" || pathname.startsWith("/app/");
}
