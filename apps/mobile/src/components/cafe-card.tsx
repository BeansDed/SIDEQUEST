import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { scoreCafe } from "@/domain/selectors";
import type { Cafe, Preferences } from "@/domain/types";
import { useConsumer } from "@/state/consumer-provider";
import { colors, radii, typography } from "@/theme/tokens";

export function CafeCard({ cafe, preferences, onOpen, compact = false }: { cafe: Cafe; preferences: Preferences; onOpen(): void; compact?: boolean }) {
  const { state, toggleSave } = useConsumer();
  const saved = state.collections.some((collection) => collection.cafeIds.includes(cafe.id));
  const score = scoreCafe(cafe, preferences);
  return (
    <View style={[styles.card, compact && styles.compact]}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Open ${cafe.name}`} onPress={onOpen} style={[styles.photoWrap, compact && styles.compactPhoto]}>
        <Image source={cafe.image} accessibilityLabel={cafe.imageAlt} style={styles.photo} contentFit="cover" transition={180} />
        <View style={styles.scrim} />
        <View style={styles.matchPill}><Text style={styles.matchPillText}>{score}% match</Text></View>
      </Pressable>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <Pressable onPress={onOpen} style={styles.titlePressable}><Text style={styles.kicker}>{cafe.neighborhood}</Text><Text style={styles.title}>{cafe.name}</Text></Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={saved ? `Remove ${cafe.name} from saved` : `Save ${cafe.name}`} onPress={() => toggleSave(cafe.id)} style={[styles.save, saved && styles.saved]}>
            <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={20} color={saved ? colors.caramel : colors.espresso} />
          </Pressable>
        </View>
        <Text style={styles.vibes}>{[...cafe.vibes, cafe.useCases[0]].join(" · ")}</Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>{cafe.walkMinutes} min</Text><Text style={styles.dot}>•</Text>
          <Text style={styles.metaText}>₱{cafe.averagePrice} avg</Text><Text style={styles.dot}>•</Text>
          <Text style={styles.metaText}>{cafe.openNow ? `until ${cafe.closesAt}` : "closed"}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { overflow: "hidden", borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, backgroundColor: colors.paper, shadowColor: colors.espresso, shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 3 },
  compact: { flexDirection: "row" },
  photoWrap: { height: 188, justifyContent: "flex-end" },
  compactPhoto: { width: 116, height: "auto", minHeight: 164 },
  photo: { ...StyleSheet.absoluteFillObject },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(38,21,15,0.18)" },
  matchPill: { alignSelf: "flex-start", margin: 14, paddingHorizontal: 10, paddingVertical: 7, borderWidth: 1, borderColor: "rgba(255,255,255,.45)", borderRadius: radii.pill, backgroundColor: "rgba(38,21,15,.62)" },
  matchPillText: { color: colors.white, fontFamily: typography.bodyBold, fontSize: 10, textTransform: "uppercase" },
  copy: { flex: 1, padding: 16 },
  titleRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  titlePressable: { flex: 1 },
  kicker: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase" },
  title: { marginTop: 4, color: colors.espresso, fontFamily: typography.display, fontSize: 24, lineHeight: 29 },
  save: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, borderRadius: 14, backgroundColor: colors.paper },
  saved: { backgroundColor: colors.caramelMist },
  vibes: { marginTop: 8, color: colors.inkMuted, fontFamily: typography.body, fontSize: 12 },
  meta: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 6, marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.caramelMist },
  metaText: { color: colors.inkMuted, fontFamily: typography.bodyMedium, fontSize: 10 },
  dot: { color: colors.crema },
});
