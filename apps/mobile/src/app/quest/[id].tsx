import { router, useLocalSearchParams } from "expo-router";
import { StateView } from "@/components/state-view";
import { Screen } from "@/components/screen";
import { quests } from "@/domain/catalog";
import { QuestExperienceScreen } from "@/features/quest-experience-screen";
export default function QuestRoute() { const { id } = useLocalSearchParams<{ id: string }>(); const quest = quests.find((item) => item.id === id); if (!quest) return <Screen><StateView kind="error" title="Quest not found." message="Choose another challenge from the quest board." action="See quests" onAction={() => router.replace("/(tabs)/quests")} /></Screen>; return <QuestExperienceScreen quest={quest} onBack={() => router.back()} />; }
