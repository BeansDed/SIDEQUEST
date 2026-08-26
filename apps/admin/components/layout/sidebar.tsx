import {
  BarChart3,
  Coffee,
  Compass,
  Flag,
  LayoutDashboard,
  MapPinned,
  ShieldCheck,
  Users,
  Megaphone,
  Tags,
  Trophy,
  CreditCard,
  ScrollText,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { can, type Capability, type StaffRole } from "@/lib/roles";

export const NAV_ITEMS: Array<{ label: string; href: string; icon: typeof LayoutDashboard; capability: Capability }> = [
  { label: "Overview", href: "/overview", icon: LayoutDashboard, capability: "dashboard:view" },
  { label: "Cafés", href: "/cafes", icon: Coffee, capability: "cafe:view" },
  { label: "Taxonomy", href: "/taxonomy", icon: Tags, capability: "taxonomy:view" },
  { label: "Featured", href: "/featured", icon: MapPinned, capability: "featured:view" },
  { label: "Quests", href: "/quests", icon: Compass, capability: "quest:view" },
  { label: "Achievements", href: "/achievements", icon: Trophy, capability: "achievement:view" },
  { label: "Moderation", href: "/moderation", icon: ShieldCheck, capability: "report:view" },
  { label: "Users", href: "/users", icon: Users, capability: "user:view" },
  { label: "Announcements", href: "/announcements", icon: Megaphone, capability: "announcement:view" },
  { label: "Subscriptions", href: "/subscriptions", icon: CreditCard, capability: "subscription:view" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, capability: "analytics:view" },
  { label: "Staff", href: "/staff", icon: UserCog, capability: "staff:view" },
  { label: "Audit", href: "/audit", icon: ScrollText, capability: "audit:view" },
  { label: "System", href: "/health", icon: Flag, capability: "health:view" },
];

export function Sidebar({ role = "super_admin" }: { role?: StaffRole }) {
  const navigation = NAV_ITEMS.filter((item) => can(role, item.capability));
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
          <small>{role.replace("_", " ")}</small>
        </span>
      </div>
    </nav>
  );
}
