import { redirect } from "next/navigation";

import { AdminShell } from "@/components/layout/admin-shell";
import { getAdminSession } from "@/lib/auth/session";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getAdminSession();
  if (!session) redirect("/staff/access");

  return <AdminShell role={session.role}>{children}</AdminShell>;
}
