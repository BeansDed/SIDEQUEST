import { router } from "expo-router";
import { QuestsScreen } from "@/features/quests-screen";
export default function QuestsRoute() { return <QuestsScreen onOpen={(id) => router.push(`/quest/${id}`)} />; }
