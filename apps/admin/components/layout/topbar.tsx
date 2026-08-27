import { Bell, ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import { NAV_ITEMS } from "./sidebar";
import { can, type StaffRole } from "@/lib/roles";

export function Topbar({ role = "super_admin" }: { role?: StaffRole }) {
  const quickLinks = NAV_ITEMS.filter((item) => can(role, item.capability));
  return (
    <header className="topbar">
      <details className="mobile-menu">
        <summary>
          <span>SIDEQUEST</span>
          <ChevronDown aria-hidden="true" size={16} />
        </summary>
        <nav aria-label="Mobile admin navigation">
          {quickLinks.map(({ label, href }) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
      </details>

      <div className="context-label">
        <span>OPERATIONS /</span>
        <strong>Overview</strong>
      </div>

      <div className="topbar-actions">
        <label className="search-control">
          <Search aria-hidden="true" size={16} />
          <span className="sr-only">Search admin</span>
          <input placeholder="Search cafés, users, quests…" type="search" />
          <kbd>⌘ K</kbd>
        </label>
        <button className="icon-button" aria-label="Notifications" type="button">
          <Bell aria-hidden="true" size={18} />
          <span className="notification-dot" />
        </button>
      </div>
    </header>
  );
}
