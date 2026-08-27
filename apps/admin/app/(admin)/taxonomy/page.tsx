import { PageIntro } from "@/components/layout/page-intro";
import { TaxonomyManager } from "@/features/taxonomy/taxonomy-manager";
import { getAdminRepository } from "@/lib/data/provider";
export default async function TaxonomyPage() { const tags = await getAdminRepository().listTags(); return <div className="page-stack"><PageIntro eyebrow="DISCOVERY LANGUAGE" title="Vibes & taxonomy" description="Curate a small, understandable vocabulary explorers can actually use." actions={<button className="button button-primary">New tag</button>} /><TaxonomyManager tags={tags} /></div>; }
