import { router } from "expo-router";
import { HomeScreen } from "@/features/home-screen";
export default function HomeRoute() { return <HomeScreen onOpenCafe={(id) => router.push(`/cafe/${id}`)} onDiscover={() => router.push("/(tabs)/discover")} onOpenQuest={(id) => router.push(`/quest/${id}`)} />; }
