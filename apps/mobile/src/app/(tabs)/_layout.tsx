import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { colors, typography } from "@/theme/tokens";

const icons = { index: "home", discover: "compass", quests: "sparkles", saved: "bookmark", profile: "person" } as const;

export default function TabsLayout() {
  return <Tabs screenOptions={({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: colors.crema,
    tabBarInactiveTintColor: "rgba(255,255,255,.56)",
    tabBarLabelStyle: { fontFamily: typography.bodyBold, fontSize: 9, marginTop: 2 },
    tabBarStyle: { position: "absolute", right: 12, bottom: 10, left: 12, height: 76, paddingTop: 8, paddingBottom: 10, borderTopWidth: 0, borderRadius: 24, backgroundColor: "rgba(38,21,15,.97)", shadowColor: colors.espresso, shadowOpacity: .22, shadowRadius: 18, shadowOffset: { width: 0, height: 9 }, elevation: 12 },
    tabBarIcon: ({ color, size }) => <Ionicons name={icons[route.name as keyof typeof icons] ?? "ellipse"} size={size} color={color} />,
  })}>
    <Tabs.Screen name="index" options={{ title: "Home" }} />
    <Tabs.Screen name="discover" options={{ title: "Discover" }} />
    <Tabs.Screen name="quests" options={{ title: "Quests" }} />
    <Tabs.Screen name="saved" options={{ title: "Saved" }} />
    <Tabs.Screen name="profile" options={{ title: "Profile" }} />
  </Tabs>;
}
