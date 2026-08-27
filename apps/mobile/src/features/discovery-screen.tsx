import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { CafeCard } from "@/components/cafe-card";
import { Chip } from "@/components/chip";
import { Screen } from "@/components/screen";
import { StateView } from "@/components/state-view";
import { cafes } from "@/domain/catalog";
import { filterCafes } from "@/domain/selectors";
import type { Vibe } from "@/domain/types";
import { useConsumer } from "@/state/consumer-provider";
import { colors, radii, typography } from "@/theme/tokens";

const vibes: Vibe[] = ["quiet", "warm", "creative", "garden", "minimal", "lively"];

function CafeMap({ items, onOpen }: { items: typeof cafes; onOpen(id: string): void }) {
  if (Platform.OS !== "web") {
    const maps = require("react-native-maps") as typeof import("react-native-maps");
    const MapView = maps.default;
    const Marker = maps.Marker;
    return <MapView style={styles.map} initialRegion={{ latitude: 14.559, longitude: 121.026, latitudeDelta: .07, longitudeDelta: .07 }}>{items.map((cafe) => <Marker key={cafe.id} coordinate={{ latitude: cafe.latitude, longitude: cafe.longitude }} title={cafe.name} description={`₱${cafe.averagePrice} · ${cafe.vibes.join(", ")}`} onCalloutPress={() => onOpen(cafe.id)} pinColor={colors.caramel} />)}</MapView>;
  }
  return <View style={styles.mapFallback}>{items.map((cafe, index) => <Pressable key={cafe.id} onPress={() => onOpen(cafe.id)} style={[styles.pin, { left: `${16 + (index * 21) % 72}%`, top: `${18 + (index * 19) % 65}%` }]}><Ionicons name="cafe" size={17} color={colors.white} /><Text style={styles.pinLabel}>{cafe.name}</Text></Pressable>)}</View>;
}

export function DiscoveryScreen({ onOpenCafe }: { onOpenCafe(id: string): void }) {
  const { state, setFilters, clearFilters } = useConsumer();
  const [mode, setMode] = useState<"list" | "map">("list");
  const results = filterCafes(cafes, state.filters);
  const toggleVibe = (vibe: Vibe) => setFilters({ vibes: state.filters.vibes.includes(vibe) ? state.filters.vibes.filter((item) => item !== vibe) : [...state.filters.vibes, vibe] });
  return <Screen>
    <Text style={styles.eyebrow}>DISCOVER · MAKATI</Text><Text style={styles.title}>Find your table.</Text><Text style={styles.subtitle}>Search by the way you want the next hour to feel.</Text>
    <View style={styles.search}><Ionicons name="search" size={19} color={colors.inkMuted} /><TextInput accessibilityLabel="Search cafés" placeholder="Café, neighborhood, or amenity" placeholderTextColor={colors.inkMuted} value={state.filters.search} onChangeText={(search) => setFilters({ search })} style={styles.input} /></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>{vibes.map((vibe) => <Chip key={vibe} label={vibe} selected={state.filters.vibes.includes(vibe)} onPress={() => toggleVibe(vibe)} />)}<Chip label="open now" selected={state.filters.openNow} onPress={() => setFilters({ openNow: !state.filters.openNow })} /></ScrollView>
    <View style={styles.toolbar}><Text style={styles.count}>{results.length} MATCH{results.length === 1 ? "" : "ES"}</Text><View style={styles.segment}><Pressable accessibilityLabel="List view" onPress={() => setMode("list")} style={[styles.segmentButton, mode === "list" && styles.segmentActive]}><Ionicons name="list" size={18} color={mode === "list" ? colors.white : colors.espresso} /></Pressable><Pressable accessibilityLabel="Map view" onPress={() => setMode("map")} style={[styles.segmentButton, mode === "map" && styles.segmentActive]}><Ionicons name="map" size={18} color={mode === "map" ? colors.white : colors.espresso} /></Pressable></View></View>
    {results.length === 0 ? <StateView title="No café fits all of that." message="Widen the distance or remove one vibe to see more options." action="Clear filters" onAction={clearFilters} /> : mode === "map" ? <CafeMap items={results} onOpen={onOpenCafe} /> : <View style={styles.list}>{results.map((cafe) => <CafeCard key={cafe.id} cafe={cafe} preferences={state.preferences} compact onOpen={() => onOpenCafe(cafe.id)} />)}{state.filters.vibes.length > 0 ? <Pressable onPress={clearFilters} style={styles.clear}><Text style={styles.clearText}>Clear filters</Text></Pressable> : <View><Text style={styles.clearText}>Clear filters</Text></View>}</View>}
  </Screen>;
}

const styles = StyleSheet.create({
  eyebrow: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 10, letterSpacing: 1.1 },
  title: { marginTop: 7, color: colors.espresso, fontFamily: typography.display, fontSize: 36 },
  subtitle: { marginTop: 4, color: colors.inkMuted, fontFamily: typography.body, fontSize: 13 },
  search: { minHeight: 52, flexDirection: "row", alignItems: "center", gap: 10, marginTop: 20, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.paper },
  input: { flex: 1, color: colors.espresso, fontFamily: typography.body, fontSize: 12 },
  filters: { gap: 8, paddingVertical: 14 },
  toolbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  count: { color: colors.inkMuted, fontFamily: typography.bodyBold, fontSize: 10, letterSpacing: .8 },
  segment: { flexDirection: "row", padding: 3, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.paper },
  segmentButton: { width: 38, height: 34, alignItems: "center", justifyContent: "center", borderRadius: 9 },
  segmentActive: { backgroundColor: colors.espresso },
  list: { gap: 13 },
  clear: { minHeight: 48, alignItems: "center", justifyContent: "center" },
  clearText: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 12, textAlign: "center" },
  map: { height: 520, overflow: "hidden", borderRadius: radii.lg },
  mapFallback: { position: "relative", height: 520, overflow: "hidden", borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, backgroundColor: colors.caramelMist },
  pin: { position: "absolute", width: 44, height: 44, alignItems: "center", justifyContent: "center", borderWidth: 4, borderColor: colors.paper, borderRadius: 22, backgroundColor: colors.caramel },
  pinLabel: { position: "absolute", top: 46, width: 100, color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 8, textAlign: "center" },
});
