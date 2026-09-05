import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { CafeCard } from "@/components/cafe-card";
import { Screen } from "@/components/screen";
import { StateView } from "@/components/state-view";
import { StatusRail } from "@/components/status-rail";
import { VibeDial } from "@/components/vibe-dial";
import { quests } from "@/domain/catalog";
import { useCafes } from "@/data/cafe-provider";
import { scoreCafe, selectRecentCafes } from "@/domain/selectors";
import type { Vibe } from "@/domain/types";
import { useConsumer } from "@/state/consumer-provider";
import { useAppTheme, type AppPalette } from "@/theme/app-theme";
import { radii, typography } from "@/theme/tokens";

export function HomeScreen({ onOpenCafe, onDiscover, onOpenQuest, onOpenNotifications }: { onOpenCafe(id: string): void; onDiscover(): void; onOpenQuest?(id: string): void; onOpenNotifications?(): void }) {
  const { colors } = useAppTheme(); const styles = createStyles(colors);
  const { state, setFilters } = useConsumer();
  const { cafes, status, error, areaLabel, dataSource, refresh } = useCafes();
  const ranked = [...cafes].sort((a, b) => scoreCafe(b, state.preferences) - scoreCafe(a, state.preferences));
  const best = ranked[0];
  const recent = selectRecentCafes(state, cafes);
  const savedCount = new Set(state.collections.flatMap((collection) => collection.cafeIds)).size;
  const featuredQuest = quests.find((quest) => quest.id === state.activeQuestId) ?? quests.find((quest) => !state.completedQuestIds.includes(quest.id)) ?? quests[0];
  const toggleVibe = (vibe: Vibe) => {
    const selected = state.filters.vibes.includes(vibe) ? state.filters.vibes.filter((item) => item !== vibe) : [vibe];
    setFilters({ vibes: selected });
  };
  return <Screen>
    <View style={styles.header}><View><Text style={styles.location}>{areaLabel.toUpperCase()} · {dataSource === "live" ? `${cafes.length} LIVE CAFÉS` : `${cafes.length} BUNDLED CAFÉS`}</Text><Text style={styles.title}>Good afternoon,{"\n"}{state.name}.</Text><Text style={styles.subtitle}>What does today need?</Text></View><Pressable accessibilityLabel="Notification preferences" onPress={onOpenNotifications} style={styles.bell}><Ionicons name="notifications-outline" size={22} color={colors.espresso} /></Pressable></View>
    <Pressable onPress={onDiscover} style={styles.prompt}><Text style={styles.promptText}>Make matches feel like you</Text><Text style={styles.promptAction}>Explore →</Text></Pressable>
    <StatusRail openCount={cafes.filter((cafe) => cafe.openNow).length} savedCount={savedCount} activeStep={state.activeQuestId ? state.questStep + 1 : null} xp={state.xp} />
    <VibeDial selected={state.filters.vibes} onToggle={toggleVibe} />
    <View style={styles.section}><Text style={styles.sectionLabel}>YOUR BEST MATCH</Text><Pressable onPress={onDiscover}><Text style={styles.link}>See all</Text></Pressable></View>
    {best ? <CafeCard cafe={best} preferences={state.preferences} onOpen={() => onOpenCafe(best.id)} /> : status === "loading" ? <StateView title="Finding your best nearby café…" message="Using your current location and Google Places." /> : <StateView kind="error" title="No live café match yet." message={error ?? (status === "permission-denied" ? "Allow location access to see real nearby cafés." : "Open Discover to retry your location.")} action="Open Discover" onAction={onDiscover} secondaryAction="Retry" onSecondaryAction={() => void refresh()} />}
    {recent.length > 0 ? <><View style={styles.section}><Text style={styles.sectionLabel}>RECENTLY VIEWED</Text></View><View style={styles.recentList}>{recent.map((cafe) => <CafeCard key={cafe.id} cafe={cafe} preferences={state.preferences} compact onOpen={() => onOpenCafe(cafe.id)} />)}</View></> : null}
    <View style={styles.section}><Text style={styles.sectionLabel}>A SMALL SIDEQUEST</Text></View>
    <Pressable onPress={() => onOpenQuest?.(featuredQuest.id)} style={styles.quest}><View style={styles.questRing}><Ionicons name="sparkles" size={24} color={colors.crema} /></View><View style={styles.questCopy}><Text style={styles.questKicker}>{state.activeQuestId === featuredQuest.id ? `CONTINUE · STEP ${state.questStep + 1}` : `+${featuredQuest.xp} XP · ${featuredQuest.durationMinutes} MIN`}</Text><Text style={styles.questTitle}>{featuredQuest.title}</Text><Text style={styles.questText}>{featuredQuest.description}</Text></View><Ionicons name="chevron-forward" size={20} color={colors.crema} /></Pressable>
  </Screen>;
}

const createStyles = (colors: AppPalette) => StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", gap: 14 },
  location: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 10, letterSpacing: 1.1 },
  title: { marginTop: 8, color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 28, lineHeight: 34 },
  subtitle: { marginTop: 5, color: colors.inkMuted, fontFamily: typography.body, fontSize: 13 },
  bell: { flexShrink: 0, width: 46, height: 46, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, borderRadius: 15, backgroundColor: colors.paper },
  prompt: { minHeight: 50, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 20, paddingHorizontal: 16, borderRadius: radii.md, backgroundColor: colors.brandSurface },
  promptText: { color: "rgba(255,255,255,.95)", fontFamily: typography.bodyMedium, fontSize: 11 },
  promptAction: { color: colors.crema, fontFamily: typography.bodyBold, fontSize: 11 },
  section: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 26, marginBottom: 12 },
  sectionLabel: { color: colors.inkMuted, fontFamily: typography.bodyBold, fontSize: 10, letterSpacing: 1 },
  link: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 11 },
  quest: { minHeight: 108, flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: radii.lg, backgroundColor: colors.brandSurface },
  questRing: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  questCopy: { flex: 1 },
  questKicker: { color: colors.crema, fontFamily: typography.bodyBold, fontSize: 9, letterSpacing: .8 },
  questTitle: { marginTop: 4, color: colors.white, fontFamily: typography.displaySemibold, fontSize: 18 },
  questText: { marginTop: 3, color: "rgba(255,255,255,.90)", fontFamily: typography.body, fontSize: 12, lineHeight: 18 },
  recentList: { gap: 12 },
});
