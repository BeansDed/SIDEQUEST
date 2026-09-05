import { router, useLocalSearchParams } from "expo-router";
import { StateView } from "@/components/state-view";
import { Screen } from "@/components/screen";
import { useCafes } from "@/data/cafe-provider";
import { ReviewScreen } from "@/features/review-screen";
export default function ReviewRoute() { const { id } = useLocalSearchParams<{ id: string }>(); const { getCafe } = useCafes(); const cafe = getCafe(id); if (!cafe) return <Screen><StateView kind="error" title="Café not found." message="Return to Discover and choose another live Google listing." action="Discover cafés" onAction={() => router.replace("/(tabs)/discover")} /></Screen>; return <ReviewScreen cafe={cafe} onDone={() => router.replace(`/cafe/${cafe.id}`)} />; }
