import { notFound } from "next/navigation";

import { CafeDetailScreen } from "@/features/consumer/cafe-detail-screen";
import { cafes } from "@/features/consumer/domain";

export default async function CafeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cafe = cafes.find((item) => item.id === id);
  if (!cafe) notFound();
  return <CafeDetailScreen cafe={cafe} />;
}
