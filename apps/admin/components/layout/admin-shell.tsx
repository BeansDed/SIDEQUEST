import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Sidebar />
      <div className="workspace">
        <Topbar />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
