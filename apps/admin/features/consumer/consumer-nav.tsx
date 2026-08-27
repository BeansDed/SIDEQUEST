"use client";

import { Bookmark, Compass, Home, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/app", label: "Home", icon: Home, exact: true },
  { href: "/app/discover", label: "Discover", icon: Compass },
  { href: "/app/quests", label: "Quests", icon: Sparkles },
  { href: "/app/saved", label: "Saved", icon: Bookmark },
  { href: "/app/profile", label: "Profile", icon: UserRound },
];

export function ConsumerNav() {
  const pathname = usePathname();
  return (
    <nav className="consumer-nav" aria-label="Consumer navigation">
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link key={href} href={href} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined}>
            <Icon size={19} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
