import { router, useLocalSearchParams } from "expo-router";
import { StateView } from "@/components/state-view";
import { Screen } from "@/components/screen";
import { cafes } from "@/domain/catalog";
import { ReviewScreen } from "@/features/review-screen";
export default function ReviewRoute() { const { id } = useLocalSearchParams<{ id: string }>(); const cafe = cafes.find((item) => item.id === id); if (!cafe) return <Screen><StateView kind="error" title="Café not found." message="Return to Discover and choose another café." action="Discover cafés" onAction={() => router.replace("/(tabs)/discover")} /></Screen>; return <ReviewScreen cafe={cafe} onDone={() => router.replace(`/cafe/${cafe.id}`)} />; }
