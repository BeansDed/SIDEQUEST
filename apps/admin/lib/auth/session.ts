import type { StaffRole } from "@/lib/roles";

export interface AdminSession {
  id: string;
  name: string;
  role: StaffRole;
  mode: "demo" | "production";
}

export function getDemoSession(role: StaffRole = "super_admin"): AdminSession {
  return { id: `demo-${role}`, name: "Mika Santos", role, mode: "demo" };
}
