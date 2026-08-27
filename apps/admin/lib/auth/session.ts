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

export async function getAdminSession(): Promise<AdminSession | null> {
  if (process.env.NEXT_PUBLIC_APP_MODE !== "production") return getDemoSession();
  const { createSupabaseServerClient } = await import("@/lib/supabase/server");
  const client = await createSupabaseServerClient();
  if (!client) return null;
  const { data: { user } } = await client.auth.getUser();
  if (!user) return null;
  const { data: staff } = await client.from("staff_profiles").select("id,display_name,role,status").eq("user_id", user.id).eq("status", "active").maybeSingle();
  if (!staff) return null;
  return { id: staff.id, name: staff.display_name, role: staff.role as StaffRole, mode: "production" };
}
