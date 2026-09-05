import { router } from "expo-router";

import { SettingsScreen } from "@/features/settings-screen";

export default function SettingsRoute() {
  return <SettingsScreen onOpenFlow={(slug) => router.push({ pathname: "/flow/[slug]", params: { slug } })} />;
}
