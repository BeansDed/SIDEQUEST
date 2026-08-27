import { router } from "expo-router";

import { OnboardingScreen } from "@/features/onboarding-screen";

export default function OnboardingRoute() {
  return <OnboardingScreen onDone={() => router.replace("/(tabs)")} />;
}
