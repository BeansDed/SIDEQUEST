import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { typography } from "@/theme/tokens";
import { useAppTheme } from "@/theme/app-theme";

const icons = { index: "home", discover: "compass", quests: "sparkles", saved: "bookmark", profile: "person" } as const;

export default function TabsLayout() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  return <Tabs screenOptions={({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: colors.caramel,
    tabBarInactiveTintColor: colors.inkMuted,
    tabBarLabelStyle: { fontFamily: typography.bodyMedium, fontSize: 11, marginTop: 2 },
    tabBarStyle: { height: 56 + insets.bottom, paddingTop: 4, paddingBottom: insets.bottom, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.paper, elevation: 0, shadowOpacity: 0 },
    tabBarIcon: ({ color, size }) => <Ionicons name={icons[route.name as keyof typeof icons] ?? "ellipse"} size={size} color={color} />,
  })}>
    <Tabs.Screen name="index" options={{ title: "Home" }} />
    <Tabs.Screen name="discover" options={{ title: "Discover" }} />
    <Tabs.Screen name="quests" options={{ title: "Quests" }} />
    <Tabs.Screen name="saved" options={{ title: "Saved" }} />
    <Tabs.Screen name="profile" options={{ title: "Profile" }} />
  </Tabs>;
}
