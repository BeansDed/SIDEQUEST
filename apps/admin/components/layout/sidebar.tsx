import {
  BarChart3,
  Coffee,
  Compass,
  Flag,
  LayoutDashboard,
  MapPinned,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

const navigation = [
  { label: "Overview", href: "/overview", icon: LayoutDashboard },
  { label: "Cafés", href: "/cafes", icon: Coffee },
  { label: "Quests", href: "/quests", icon: Compass },
  { label: "Moderation", href: "/moderation", icon: ShieldCheck },
  { label: "Users", href: "/users", icon: Users },
  { label: "Featured", href: "/featured", icon: MapPinned },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "System", href: "/health", icon: Flag },
];

export function Sidebar() {
  return (
    <nav className="sidebar" aria-label="Admin navigation">
      <div className="brand-lockup">
        <span className="brand-mark" aria-hidden="true">
          SQ
        </span>
        <span>
          <strong>SIDEQUEST</strong>
          <small>Café operations</small>
        </span>
      </div>

      <div className="service-ticket" aria-label="Service status">
        <span className="ticket-label">TODAY’S SERVICE</span>
        <strong>All systems serving</strong>
        <span className="ticket-meta">
          <i aria-hidden="true" /> 14 cafés open now
        </span>
      </div>

      <div className="nav-list">
        {navigation.map(({ label, href, icon: Icon }, index) => (
          <Link
            className={index === 0 ? "nav-link is-active" : "nav-link"}
            href={href}
            key={href}
          >
            <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
            <span>{label}</span>
          </Link>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="avatar" aria-hidden="true">
          AN
        </div>
        <span>
          <strong>Ardre N.</strong>
          <small>Super admin</small>
        </span>
      </div>
    </nav>
  );
}
