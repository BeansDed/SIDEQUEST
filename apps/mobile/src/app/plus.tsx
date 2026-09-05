import { router } from "expo-router";

import { PlusScreen } from "@/features/plus-screen";

export default function PlusRoute() {
  return <PlusScreen onManagePlan={() => router.push("/flow/active-plan")} />;
}
