import { notFound } from "next/navigation";

import { quests } from "@/features/consumer/domain";
import { QuestExperience } from "@/features/consumer/quest-experience";

export default async function QuestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!quests.some((quest) => quest.id === id)) notFound();
  return <QuestExperience questId={id} />;
}
