import Link from "next/link";
import { notFound } from "next/navigation";
import { CafeEditor } from "@/features/cafes/cafe-editor";
import { getAdminRepository } from "@/lib/data/provider";
export default async function CafeDetailPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const cafe = (await getAdminRepository().listCafes()).find((item) => item.id === id) ?? (id === "new" ? (await getAdminRepository().listCafes())[5] : undefined); if (!cafe) notFound(); return <div className="page-stack"><div className="breadcrumb"><Link href="/cafes">Cafés</Link><span>/</span><strong>{id === "new" ? "New café" : cafe.name}</strong></div><CafeEditor cafe={cafe} /></div>; }
