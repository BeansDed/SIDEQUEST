import { router, useLocalSearchParams } from "expo-router";

import type { CompletionFlowTarget } from "@/domain/completion-flows";
import { CompletionFlowScreen } from "@/features/completion-flow-screen";

function navigate(target: CompletionFlowTarget) {
  if (target === "home") return router.replace("/(tabs)");
  if (target === "settings") return router.replace("/settings");
  if (target === "profile") return router.replace("/(tabs)/profile");
  if (target === "onboarding") return router.replace("/onboarding");
  if (target === "plus") return router.replace("/plus");
  return router.push({ pathname: "/flow/[slug]", params: { slug: target } });
}

export default function CompletionFlowRoute() {
  const { slug } = useLocalSearchParams<{ slug: string | string[] }>();
  return <CompletionFlowScreen slug={slug} onNavigate={navigate} />;
}
