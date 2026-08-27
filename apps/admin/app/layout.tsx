import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope, Sora } from "next/font/google";
import { AdminShell } from "@/components/layout/admin-shell";
import "./globals.css";
import { getAdminSession } from "@/lib/auth/session";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "SIDEQUEST Café Operations",
  description: "Café discovery operations and moderation dashboard.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getAdminSession();
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable} ${plexMono.variable}`}>
      <body>
        <AdminShell role={session?.role ?? "analyst"}>{children}</AdminShell>
        {process.env.NODE_ENV === "development" ? <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async /> : null}
      </body>
    </html>
  );
}
