import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { CafeCard } from "@/components/cafe-card";
import { Screen } from "@/components/screen";
import { VibeDial } from "@/components/vibe-dial";
import { cafes, quests } from "@/domain/catalog";
import { scoreCafe } from "@/domain/selectors";
import type { Vibe } from "@/domain/types";
import { useConsumer } from "@/state/consumer-provider";
import { colors, radii, typography } from "@/theme/tokens";

export function HomeScreen({ onOpenCafe, onDiscover, onOpenQuest }: { onOpenCafe(id: string): void; onDiscover(): void; onOpenQuest?(id: string): void }) {
  const { state, setFilters } = useConsumer();
  const ranked = [...cafes].sort((a, b) => scoreCafe(b, state.preferences) - scoreCafe(a, state.preferences));
  const best = ranked[0];
  const toggleVibe = (vibe: Vibe) => {
    const selected = state.filters.vibes.includes(vibe) ? state.filters.vibes.filter((item) => item !== vibe) : [vibe];
    setFilters({ vibes: selected });
  };
  return <Screen>
    <View style={styles.header}><View><Text style={styles.location}>MAKATI · 4 CAFÉS NEARBY</Text><Text style={styles.title}>Good afternoon,{"\n"}{state.name}.</Text><Text style={styles.subtitle}>What does today need?</Text></View><View style={styles.bell}><Ionicons name="notifications-outline" size={22} color={colors.espresso} /></View></View>
    <Pressable onPress={onDiscover} style={styles.prompt}><Text style={styles.promptText}>Make matches feel like you</Text><Text style={styles.promptAction}>Explore →</Text></Pressable>
    <VibeDial selected={state.filters.vibes} onToggle={toggleVibe} />
    <View style={styles.section}><Text style={styles.sectionLabel}>YOUR BEST MATCH</Text><Pressable onPress={onDiscover}><Text style={styles.link}>See all</Text></Pressable></View>
    <CafeCard cafe={best} preferences={state.preferences} onOpen={() => onOpenCafe(best.id)} />
    <View style={styles.section}><Text style={styles.sectionLabel}>A SMALL SIDEQUEST</Text></View>
    <Pressable onPress={() => onOpenQuest?.(quests[0].id)} style={styles.quest}><View style={styles.questRing}><Ionicons name="sparkles" size={24} color={colors.crema} /></View><View style={styles.questCopy}><Text style={styles.questKicker}>+{quests[0].xp} XP · {quests[0].durationMinutes} MIN</Text><Text style={styles.questTitle}>{quests[0].title}</Text><Text style={styles.questText}>{quests[0].description}</Text></View><Ionicons name="chevron-forward" size={20} color={colors.crema} /></Pressable>
  </Screen>;
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", gap: 14 },
  location: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 10, letterSpacing: 1.1 },
  title: { marginTop: 8, color: colors.espresso, fontFamily: typography.display, fontSize: 34, lineHeight: 37 },
  subtitle: { marginTop: 5, color: colors.inkMuted, fontFamily: typography.body, fontSize: 13 },
  bell: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, borderRadius: 15, backgroundColor: colors.paper },
  prompt: { minHeight: 50, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 20, paddingHorizontal: 16, borderRadius: radii.md, backgroundColor: colors.espresso },
  promptText: { color: "rgba(255,255,255,.72)", fontFamily: typography.bodyMedium, fontSize: 11 },
  promptAction: { color: colors.crema, fontFamily: typography.bodyBold, fontSize: 11 },
  section: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 26, marginBottom: 12 },
  sectionLabel: { color: colors.inkMuted, fontFamily: typography.bodyBold, fontSize: 10, letterSpacing: 1 },
  link: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 11 },
  quest: { minHeight: 124, flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: radii.lg, backgroundColor: colors.espresso },
  questRing: { width: 62, height: 62, alignItems: "center", justifyContent: "center", borderWidth: 11, borderColor: "rgba(229,198,165,.18)", borderRadius: 31, backgroundColor: colors.caramel },
  questCopy: { flex: 1 },
  questKicker: { color: colors.crema, fontFamily: typography.bodyBold, fontSize: 9, letterSpacing: .8 },
  questTitle: { marginTop: 4, color: colors.white, fontFamily: typography.displaySemibold, fontSize: 18 },
  questText: { marginTop: 3, color: "rgba(255,255,255,.62)", fontFamily: typography.body, fontSize: 10, lineHeight: 15 },
});
