import { router, useLocalSearchParams } from "expo-router";
import { StateView } from "@/components/state-view";
import { Screen } from "@/components/screen";
import { cafes } from "@/domain/catalog";
import { CafeDetailScreen } from "@/features/cafe-detail-screen";
export default function CafeRoute() { const { id } = useLocalSearchParams<{ id: string }>(); const cafe = cafes.find((item) => item.id === id); if (!cafe) return <Screen><StateView kind="error" title="Café not found." message="This listing may have moved or been archived." action="Return home" onAction={() => router.replace("/(tabs)")} /></Screen>; return <CafeDetailScreen cafe={cafe} onBack={() => router.back()} onReview={() => router.push(`/review/${cafe.id}`)} />; }
