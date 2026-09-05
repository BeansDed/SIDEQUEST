import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/screen";
import { StateView } from "@/components/state-view";
import { useConsumer } from "@/state/consumer-provider";
import { useAppTheme, type AppPalette } from "@/theme/app-theme";
import { radii, typography } from "@/theme/tokens";

export function SocialScreen() {
  const { colors } = useAppTheme(); const styles = createStyles(colors);
  const { state } = useConsumer();
  const savedCount = new Set(state.collections.flatMap((collection) => collection.cafeIds)).size;
  const activity = [
    ...state.reviews.slice(-2).map((review) => ({ initials: state.name.slice(0, 2).toUpperCase(), name: review.id, message: `${state.name} posted a ${review.rating}-star vibe check.`, place: review.note, tone: colors.caramel })),
    ...state.questHistory.slice(-2).map((entry) => ({ initials: state.name.slice(0, 2).toUpperCase(), name: `${entry.questId}-${entry.completedAt}`, message: `${state.name} finished a SIDEQUEST.`, place: `+${entry.xp} XP · saved on this device`, tone: colors.sage })),
    ...(savedCount ? [{ initials: state.name.slice(0, 2).toUpperCase(), name: "saved-summary", message: `${state.name} has ${savedCount} saved café${savedCount === 1 ? "" : "s"}.`, place: "Private collection activity", tone: colors.espressoSoft }] : []),
  ];

  if (state.settings.socialVisibility === "private") {
    return (
      <Screen>
        <Text style={styles.kicker}>YOUR CIRCLE</Text>
        <Text style={styles.title}>Café stories, without the performance.</Text>
        <StateView
          title="Your activity is private."
          message="Change social visibility in Settings whenever you want to share visits with friends."
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.kicker}>YOUR CIRCLE</Text>
      <Text style={styles.title}>Café stories, without the performance.</Text>
      <Text style={styles.subtitle}>Only friends you approve can see your shared visits.</Text>
      <View style={styles.privacyNote}>
        <Ionicons name="lock-closed-outline" size={18} color={colors.sage} />
        <Text style={styles.privacyText}>Friends only · location is never shared live</Text>
      </View>
      <View style={styles.list}>
        {activity.length === 0 ? <StateView title="No shared activity yet." message="Complete a quest, save a café, or post a vibe check to build your device-local activity." /> : activity.map((item) => (
          <View key={item.name} style={styles.card}>
            <View style={[styles.avatar, { backgroundColor: item.tone }]}>
              <Text style={styles.avatarText}>{item.initials}</Text>
            </View>
            <View style={styles.copy}>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.place}>{item.place}</Text>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const createStyles = (colors: AppPalette) => StyleSheet.create({
  kicker: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 10, letterSpacing: 1 },
  title: { maxWidth: 340, marginTop: 8, color: colors.espresso, fontFamily: typography.display, fontSize: 34, lineHeight: 38 },
  subtitle: { marginTop: 7, color: colors.inkMuted, fontFamily: typography.body, fontSize: 12, lineHeight: 18 },
  privacyNote: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 20, padding: 13, borderRadius: radii.md, backgroundColor: colors.sageMist },
  privacyText: { color: colors.sage, fontFamily: typography.bodyBold, fontSize: 10 },
  list: { gap: 11, marginTop: 18 },
  card: { minHeight: 84, flexDirection: "row", alignItems: "center", gap: 13, padding: 14, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, backgroundColor: colors.paper },
  avatar: { width: 50, height: 50, alignItems: "center", justifyContent: "center", borderRadius: 17 },
  avatarText: { color: colors.white, fontFamily: typography.bodyBold, fontSize: 11 },
  copy: { flex: 1 },
  message: { color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 12 },
  place: { marginTop: 4, color: colors.inkMuted, fontFamily: typography.body, fontSize: 9 },
});
