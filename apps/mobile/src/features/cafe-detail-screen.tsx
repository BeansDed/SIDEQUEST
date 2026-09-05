import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { useState } from "react";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";

import { CafeSnapshot } from "@/components/cafe-snapshot";
import { Chip } from "@/components/chip";
import { Screen } from "@/components/screen";
import { VisitPlanner } from "@/components/visit-planner";
import { scoreCafe, selectCafeReviewSummary } from "@/domain/selectors";
import type { Cafe } from "@/domain/types";
import { useConsumer } from "@/state/consumer-provider";
import { useAppTheme, type AppPalette } from "@/theme/app-theme";
import { radii, typography } from "@/theme/tokens";

export function CafeDetailScreen({ cafe, onBack, onReview }: { cafe: Cafe; onBack(): void; onReview(): void }) {
  const { colors } = useAppTheme(); const styles = createStyles(colors);
  const { state, toggleSave, saveVisitPlan, removeVisitPlan } = useConsumer();
  const [shareError, setShareError] = useState<string | null>(null);
  const saved = state.collections.some((collection) => collection.cafeIds.includes(cafe.id));
  const score = scoreCafe(cafe, state.preferences);
  const reviewSummary = selectCafeReviewSummary(state, cafe.id);
  const directions = () => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${cafe.latitude},${cafe.longitude}`);
  const shareCafe = async () => {
    try {
      setShareError(null);
      await Share.share({ message: `${cafe.name} · ${cafe.neighborhood}\nhttps://www.google.com/maps/search/?api=1&query=${cafe.latitude},${cafe.longitude}\nShared from SIDEQUEST` });
    } catch {
      setShareError("Sharing is unavailable on this device.");
    }
  };
  return <Screen>
    <View style={styles.hero}><Image source={cafe.image} accessibilityLabel={cafe.imageAlt} style={styles.photo} contentFit="cover" /><View style={styles.scrim} /><Pressable accessibilityLabel="Back" onPress={onBack} style={[styles.floating, styles.back]}><Ionicons name="arrow-back" size={21} color={colors.espresso} /></Pressable><Pressable accessibilityLabel={saved ? "Remove saved café" : "Save café"} onPress={() => toggleSave(cafe.id)} style={[styles.floating, styles.bookmark]}><Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={21} color={saved ? colors.caramel : colors.espresso} /></Pressable><Text style={styles.match}>{cafe.source === "google" ? "LIVE GOOGLE LISTING" : `${score}% VIBE MATCH`}</Text></View>
    <Text style={styles.kicker}>{cafe.neighborhood}</Text><View style={styles.titleRow}><Text style={styles.title}>{cafe.name}</Text><Pressable accessibilityLabel="Share café" onPress={() => void shareCafe()} style={styles.share}><Ionicons name="share-outline" size={20} color={colors.caramel} /></Pressable></View><Text style={styles.description}>{cafe.description}</Text>
    {shareError ? <Text accessibilityRole="alert" style={styles.shareError}>{shareError}</Text> : null}
    <CafeSnapshot cafe={cafe} localReviewCount={reviewSummary.count} localReviewAverage={reviewSummary.average} />
    <View style={styles.chips}>{cafe.vibes.map((vibe) => <Chip key={vibe} label={vibe} selected />)}</View>
    <View style={styles.section}><Text style={styles.sectionKicker}>{cafe.source === "google" ? "LISTING SOURCE" : "WHY IT FITS"}</Text><Text style={styles.sectionTitle}>{cafe.source === "google" ? "Current data from Google Maps." : "Useful for your actual plan."}</Text><Text style={styles.description}>{cafe.source === "google" ? "Distance is calculated from your current device location. Rating, address, price level, photo, and opening status come from Google Places." : `${cafe.vibes.join(" and ")} energy for ${cafe.useCases.join(" or ")}, with ${cafe.amenities.slice(0, 2).join(" and ").toLowerCase()}.`}</Text></View>
    <View style={styles.hours}><Ionicons name="time-outline" size={22} color={colors.sage} /><View><Text style={styles.hoursTitle}>{cafe.openNow ? "Open now" : "Currently closed"}</Text><Text style={styles.hoursText}>{cafe.openNow ? `Closes at ${cafe.closesAt}` : `Next close ${cafe.closesAt}`}</Text></View></View>
    <Text style={styles.sectionKicker}>AMENITIES</Text><View style={styles.amenities}>{cafe.amenities.map((item) => <View key={item} style={styles.amenity}><Ionicons name="checkmark-circle" size={16} color={colors.sage} /><Text style={styles.amenityText}>{item}</Text></View>)}</View>
    <Text style={styles.sectionKicker}>SAVE TO COLLECTION</Text><View style={styles.collectionChoices}>{state.collections.map((collection) => { const inCollection = collection.cafeIds.includes(cafe.id); return <Pressable accessibilityState={{ selected: inCollection }} key={collection.id} onPress={() => toggleSave(cafe.id, collection.id)} style={[styles.collectionChoice, inCollection && styles.collectionSelected]}><Ionicons name={inCollection ? "bookmark" : "bookmark-outline"} size={17} color={inCollection ? colors.white : colors.caramel} /><Text style={[styles.collectionText, inCollection && styles.collectionTextSelected]}>{collection.name}</Text></Pressable>; })}</View>
    <VisitPlanner cafeId={cafe.id} plan={state.visitPlans[cafe.id]} onSave={saveVisitPlan} onRemove={() => removeVisitPlan(cafe.id)} />
    <View style={styles.actions}><Pressable onPress={directions} style={styles.primary}><Text style={styles.primaryText}>Get directions</Text></Pressable><Pressable onPress={onReview} style={styles.secondaryAction}><Text style={styles.secondaryText}>Add review</Text></Pressable></View>
  </Screen>;
}

const createStyles = (colors: AppPalette) => StyleSheet.create({
  hero: { height: 300, overflow: "hidden", marginHorizontal: -20, marginTop: -18, marginBottom: 24, justifyContent: "flex-end", padding: 22 },
  photo: { ...StyleSheet.absoluteFillObject }, scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(38,21,15,.28)" },
  floating: { position: "absolute", top: 18, width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 15, backgroundColor: "rgba(255,253,252,.93)" }, back: { left: 20 }, bookmark: { right: 20 },
  match: { color: colors.crema, fontFamily: typography.bodyBold, fontSize: 11, letterSpacing: 1 },
  kicker: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 10, letterSpacing: 1, textTransform: "uppercase" }, title: { minWidth: 0, flex: 1, marginTop: 6, color: colors.espresso, fontFamily: typography.display, fontSize: 40 },
  description: { marginTop: 8, color: colors.inkMuted, fontFamily: typography.body, fontSize: 13, lineHeight: 21 },
  meta: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: 16 }, metaText: { color: colors.inkMuted, fontFamily: typography.bodyMedium, fontSize: 11 }, chips: { flexDirection: "row", gap: 8, marginTop: 18 },
  section: { marginVertical: 28 }, sectionKicker: { marginTop: 22, color: colors.inkMuted, fontFamily: typography.bodyBold, fontSize: 10, letterSpacing: 1 }, sectionTitle: { marginTop: 8, color: colors.espresso, fontFamily: typography.displaySemibold, fontSize: 22 },
  hours: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.paper }, hoursTitle: { color: colors.sage, fontFamily: typography.bodyBold, fontSize: 13 }, hoursText: { marginTop: 3, color: colors.inkMuted, fontFamily: typography.body, fontSize: 10 },
  amenities: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }, amenity: { width: "48%", flexDirection: "row", alignItems: "center", gap: 7, padding: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.paper }, amenityText: { color: colors.espresso, fontFamily: typography.bodyMedium, fontSize: 10 },
  actions: { flexDirection: "row", gap: 10, marginTop: 10 }, primary: { flex: 1, minHeight: 52, alignItems: "center", justifyContent: "center", borderRadius: radii.md, backgroundColor: colors.brandSurface }, primaryText: { color: colors.white, fontFamily: typography.bodyBold, fontSize: 12 },
  secondary: { minHeight: 48, alignItems: "center", justifyContent: "center", marginTop: 22, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.paper }, secondaryAction: { flex: 1, minHeight: 52, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.paper }, secondaryText: { color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 12 },
  collectionChoices: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }, collectionChoice: { minHeight: 42, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: colors.border, borderRadius: radii.pill, backgroundColor: colors.paper }, collectionSelected: { borderColor: colors.caramel, backgroundColor: colors.caramel }, collectionText: { color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 10 }, collectionTextSelected: { color: colors.white },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  share: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, borderRadius: 15, backgroundColor: colors.paper },
  shareError: { marginTop: 8, color: colors.danger, fontFamily: typography.bodyBold, fontSize: 11 },
});
