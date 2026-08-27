import { AdminShell } from "@/components/layout/admin-shell";
import { getAdminSession } from "@/lib/auth/session";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getAdminSession();
  return <AdminShell role={session?.role ?? "analyst"}>{children}</AdminShell>;
}
