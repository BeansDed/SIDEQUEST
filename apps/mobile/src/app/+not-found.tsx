import { router } from "expo-router";

import { NotFoundScreen } from "@/features/not-found-screen";

export default function NotFoundRoute() {
  return <NotFoundScreen onReturnHome={() => router.replace("/(tabs)")} />;
}
