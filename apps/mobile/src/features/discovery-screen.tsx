import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { CafeCard } from "@/components/cafe-card";
import { Chip } from "@/components/chip";
import { Screen } from "@/components/screen";
import { StateView } from "@/components/state-view";
import { IntentFilter } from "@/components/intent-filter";
import { useCafes } from "@/data/cafe-provider";
import { filterCafes } from "@/domain/selectors";
import type { Cafe, UseCase, Vibe } from "@/domain/types";
import { useConsumer } from "@/state/consumer-provider";
import { useAppTheme, type AppPalette } from "@/theme/app-theme";
import { radii, typography } from "@/theme/tokens";

const vibes: Vibe[] = ["quiet", "warm", "creative", "garden", "minimal", "lively"];

function CafeMap({ items, onOpen }: { items: Cafe[]; onOpen(id: string): void }) {
  const { colors } = useAppTheme(); const styles = createStyles(colors);
  if (Platform.OS !== "web") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const maps = require("react-native-maps") as typeof import("react-native-maps");
    const MapView = maps.default;
    const Marker = maps.Marker;
    const center = items[0];
    return <MapView showsUserLocation style={styles.map} initialRegion={{ latitude: center.latitude, longitude: center.longitude, latitudeDelta: .07, longitudeDelta: .07 }}>{items.map((cafe) => <Marker key={cafe.id} coordinate={{ latitude: cafe.latitude, longitude: cafe.longitude }} title={cafe.name} description={`★ ${cafe.rating} · ${cafe.walkMinutes} min walk`} onCalloutPress={() => onOpen(cafe.id)} pinColor={colors.caramel} />)}</MapView>;
  }
  return <View style={styles.mapFallback}><Ionicons name="phone-portrait-outline" size={38} color={colors.caramel} /><Text style={styles.fallbackTitle}>The live Google map is in the Android app.</Text><Text style={styles.fallbackText}>Use list view here, or install the APK for your location and native map.</Text></View>;
}

export function DiscoveryScreen({ onOpenCafe }: { onOpenCafe(id: string): void }) {
  const { colors } = useAppTheme(); const styles = createStyles(colors);
  const { state, setFilters, clearFilters } = useConsumer();
  const { cafes, status, error, areaLabel, dataSource, refresh } = useCafes();
  const [mode, setMode] = useState<"list" | "map">("list");
  const [moreFilters, setMoreFilters] = useState(false);
  const results = filterCafes(cafes, state.filters);
  const toggleVibe = (vibe: Vibe) => setFilters({ vibes: state.filters.vibes.includes(vibe) ? state.filters.vibes.filter((item) => item !== vibe) : [...state.filters.vibes, vibe] });
  const toggleIntent = (intent: UseCase) => setFilters({ useCases: state.filters.useCases.includes(intent) ? state.filters.useCases.filter((item) => item !== intent) : [intent] });
  const hasFilters = Boolean(state.filters.search.trim() || state.filters.vibes.length || state.filters.useCases.length || state.filters.openNow || state.filters.maxPrice < 500 || state.filters.maxDistanceKm < 5);
  const stateView = status === "loading" ? <StateView title="Finding real cafés near you…" message="Using your current location and Google Places." /> : null;
  const sourceNotice = dataSource === "local" && !stateView ? error ?? "Showing the bundled Makati café guide. Tap to retry live nearby places." : null;

  return <Screen>
    <Text style={styles.eyebrow}>DISCOVER · {areaLabel.toUpperCase()}</Text><Text style={styles.title}>Find your table.</Text><Text style={styles.subtitle}>{dataSource === "live" ? "Live café listings near your current location." : "A bundled starter guide that works offline."}</Text>
    {sourceNotice ? <Pressable onPress={() => void refresh()} style={styles.notice}><Ionicons name="information-circle-outline" size={18} color={colors.caramel} /><Text style={styles.noticeText}>{sourceNotice}</Text></Pressable> : null}
    {stateView ?? <>
      <View style={styles.search}><Ionicons name="search" size={19} color={colors.inkMuted} /><TextInput accessibilityLabel="Search cafés" placeholder="Café or address" placeholderTextColor={colors.inkMuted} value={state.filters.search} onChangeText={(search) => setFilters({ search })} style={styles.input} /></View>
      <Text style={styles.intentLabel}>WHAT IS THIS VISIT FOR?</Text>
      <IntentFilter selected={state.filters.useCases} onToggle={toggleIntent} />
      {hasFilters ? <View style={styles.summary}><Text style={styles.summaryText}>{state.filters.useCases.length ? `${state.filters.useCases[0].toUpperCase()} INTENT` : "FILTERS ACTIVE"}</Text><Pressable accessibilityLabel="Reset all discovery filters" onPress={clearFilters} style={styles.reset}><Text style={styles.resetText}>Reset all</Text></Pressable></View> : null}
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: moreFilters }} onPress={() => setMoreFilters((value) => !value)} style={styles.moreFilters}><Text style={styles.resetText}>{moreFilters ? "Fewer filters" : "More filters"}</Text><Ionicons name={moreFilters ? "chevron-up" : "chevron-down"} size={18} color={colors.caramel} /></Pressable>
      {moreFilters ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>{vibes.map((vibe) => <Chip key={vibe} label={vibe} selected={state.filters.vibes.includes(vibe)} onPress={() => toggleVibe(vibe)} />)}<Chip label="open now" selected={state.filters.openNow} onPress={() => setFilters({ openNow: !state.filters.openNow })} /></ScrollView> : null}
      <View style={styles.toolbar}><Text style={styles.count}>{results.length} {dataSource === "live" ? "LIVE" : "BUNDLED"} RESULT{results.length === 1 ? "" : "S"}</Text><View style={styles.segment}><Pressable accessibilityLabel="List view" onPress={() => setMode("list")} style={[styles.segmentButton, mode === "list" && styles.segmentActive]}><Ionicons name="list" size={18} color={mode === "list" ? colors.white : colors.espresso} /></Pressable><Pressable accessibilityLabel="Map view" onPress={() => setMode("map")} style={[styles.segmentButton, mode === "map" && styles.segmentActive]}><Ionicons name="map" size={18} color={mode === "map" ? colors.white : colors.espresso} /></Pressable></View></View>
      {results.length === 0 ? <StateView title="No café fits all of that." message="Clear your filters to see more Google listings." action="Clear filters" onAction={clearFilters} /> : mode === "map" ? <CafeMap items={results} onOpen={onOpenCafe} /> : <View style={styles.list}>{results.map((cafe) => <CafeCard key={cafe.id} cafe={cafe} preferences={state.preferences} compact onOpen={() => onOpenCafe(cafe.id)} />)}{state.filters.vibes.length > 0 ? <Pressable onPress={clearFilters} style={styles.clear}><Text style={styles.clearText}>Clear filters</Text></Pressable> : null}</View>}
    </>}
  </Screen>;
}

const createStyles = (colors: AppPalette) => StyleSheet.create({
  eyebrow: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 10, letterSpacing: 1.1 },
  title: { marginTop: 7, color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 28 },
  subtitle: { marginTop: 4, color: colors.inkMuted, fontFamily: typography.body, fontSize: 13 },
  search: { minHeight: 52, flexDirection: "row", alignItems: "center", gap: 10, marginTop: 20, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.paper },
  input: { flex: 1, color: colors.espresso, fontFamily: typography.body, fontSize: 12 },
  filters: { gap: 8, paddingVertical: 14 },
  toolbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  count: { color: colors.inkMuted, fontFamily: typography.bodyBold, fontSize: 10, letterSpacing: .8 },
  segment: { flexDirection: "row", padding: 3, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.paper },
  segmentButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 9 },
  segmentActive: { backgroundColor: colors.brandSurface },
  list: { gap: 13 },
  clear: { minHeight: 48, alignItems: "center", justifyContent: "center" },
  clearText: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 12, textAlign: "center" },
  map: { height: 520, overflow: "hidden", borderRadius: radii.lg },
  mapFallback: { height: 520, alignItems: "center", justifyContent: "center", padding: 24, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, backgroundColor: colors.caramelMist },
  fallbackTitle: { marginTop: 14, color: colors.espresso, fontFamily: typography.displaySemibold, fontSize: 20, textAlign: "center" },
  fallbackText: { maxWidth: 280, marginTop: 7, color: colors.inkMuted, fontFamily: typography.body, fontSize: 12, lineHeight: 18, textAlign: "center" },
  notice: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12, padding: 12, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.caramelMist },
  noticeText: { flex: 1, color: colors.inkMuted, fontFamily: typography.bodyMedium, fontSize: 10, lineHeight: 15 },
  intentLabel: { marginTop: 18, color: colors.inkMuted, fontFamily: typography.bodyBold, fontSize: 9, letterSpacing: .9 },
  summary: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 13, borderRadius: radii.md, backgroundColor: colors.caramelMist },
  summaryText: { color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 9, letterSpacing: .8 },
  reset: { minHeight: 44, justifyContent: "center", paddingHorizontal: 8 },
  resetText: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 11 },
  moreFilters: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start", marginBottom: 8 },
});
