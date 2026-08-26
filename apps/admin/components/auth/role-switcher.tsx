"use client";

import type { StaffRole } from "@/lib/roles";

export function RoleSwitcher({ role, onChange }: { role: StaffRole; onChange?: (role: StaffRole) => void }) {
  if (process.env.NEXT_PUBLIC_APP_MODE === "production") return null;
  return (
    <label className="role-switcher">
      <span>Demo role</span>
      <select value={role} onChange={(event) => onChange?.(event.target.value as StaffRole)}>
        <option value="super_admin">Super admin</option>
        <option value="content_admin">Content admin</option>
        <option value="moderator">Moderator</option>
        <option value="analyst">Analyst</option>
      </select>
    </label>
  );
}
