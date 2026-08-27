import { router } from "expo-router";
import { DiscoveryScreen } from "@/features/discovery-screen";
export default function DiscoverRoute() { return <DiscoveryScreen onOpenCafe={(id) => router.push(`/cafe/${id}`)} />; }
