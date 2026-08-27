import { OverviewDashboard } from "@/features/overview/overview-dashboard";
import { getAdminRepository } from "@/lib/data/provider";

export default async function OverviewPage() {
  const data = await getAdminRepository().getOverview("30d");
  return <OverviewDashboard data={data} />;
}
