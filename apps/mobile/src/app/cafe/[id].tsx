import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { StateView } from "@/components/state-view";
import { Screen } from "@/components/screen";
import { useCafes } from "@/data/cafe-provider";
import { CafeDetailScreen } from "@/features/cafe-detail-screen";
import { useConsumer } from "@/state/consumer-provider";
export default function CafeRoute() { const { id } = useLocalSearchParams<{ id: string }>(); const { getCafe, status } = useCafes(); const { recordCafeView } = useConsumer(); const cafe = getCafe(id); useEffect(() => { if (cafe?.id) recordCafeView(cafe.id); }, [cafe?.id, recordCafeView]); if (!cafe) return <Screen><StateView kind="error" title={status === "loading" ? "Loading café…" : "Café not found."} message={status === "loading" ? "Refreshing the live Google listing." : "This Google listing is not in the current nearby results."} action="Return to Discover" onAction={() => router.replace("/(tabs)/discover")} /></Screen>; return <CafeDetailScreen cafe={cafe} onBack={() => router.back()} onReview={() => router.push(`/review/${cafe.id}`)} />; }
