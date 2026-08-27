import { Redirect } from "expo-router";

import { BrandedLoading } from "@/components/branded-loading";
import { useConsumer } from "@/state/consumer-provider";

export default function IndexRoute() {
  const { state } = useConsumer();
  if (!state.hydrated) return <BrandedLoading />;
  return <Redirect href={state.onboarded ? "/(tabs)" : "/onboarding"} />;
}
