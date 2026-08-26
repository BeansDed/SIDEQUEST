import { PageIntro } from "@/components/layout/page-intro";
import { FeaturedManager } from "@/features/featured/featured-manager";
import { getAdminRepository } from "@/lib/data/provider";
export default async function FeaturedPage() { const cafes = await getAdminRepository().listCafes(); return <div className="page-stack"><PageIntro eyebrow="EDITORIAL PLACEMENTS" title="Featured" description="Schedule deliberate highlights without turning discovery into an ad wall." /><FeaturedManager cafes={cafes} /></div>; }
