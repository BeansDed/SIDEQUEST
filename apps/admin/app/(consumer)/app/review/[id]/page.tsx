import { notFound } from "next/navigation";

import { cafes } from "@/features/consumer/domain";
import { ReviewScreen } from "@/features/consumer/review-screen";

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cafe = cafes.find((item) => item.id === id);
  if (!cafe) notFound();
  return <ReviewScreen cafe={cafe} />;
}
