import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import type { StaffRole } from "@/lib/roles";

export function AdminShell({ children, role = "super_admin" }: { children: ReactNode; role?: StaffRole }) {
  return (
    <div className="admin-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Sidebar role={role} />
      <div className="workspace">
        <Topbar role={role} />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
