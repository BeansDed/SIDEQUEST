import { router } from "expo-router";
import { SavedScreen } from "@/features/saved-screen";
export default function SavedRoute() { return <SavedScreen onOpenCafe={(id) => router.push(`/cafe/${id}`)} />; }
