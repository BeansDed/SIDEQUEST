import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/screen";
import { useConsumer } from "@/state/consumer-provider";
import { useAppTheme, type AppPalette } from "@/theme/app-theme";
import { radii, typography } from "@/theme/tokens";

const achievements = [
  { id: "saved", icon: "cafe" as const, title: "First sip", detail: "Saved your first café" },
  { id: "quest", icon: "sparkles" as const, title: "Small adventure", detail: "Finished a SIDEQUEST" },
  { id: "quiet", icon: "leaf" as const, title: "Quiet finder", detail: "Saved three calm spots" },
];

export function ProfileScreen({
  onOpenSettings,
  onOpenPlus,
  onOpenSocial,
  onEditProfile,
}: {
  onOpenSettings(): void;
  onOpenPlus(): void;
  onOpenSocial(): void;
  onEditProfile?(): void;
}) {
  const { state } = useConsumer();
  const { colors } = useAppTheme(); const styles = createStyles(colors);
  const level = Math.max(1, Math.floor(state.xp / 250));
  const levelProgress = state.xp % 250;
  const savedCount = new Set(state.collections.flatMap((collection) => collection.cafeIds)).size;
  const earnedAchievements = achievements.filter((achievement) => achievement.id === "saved" ? savedCount >= 1 : achievement.id === "quest" ? state.completedQuestIds.length >= 1 : savedCount >= 3);

  return (
    <Screen>
      <View style={styles.toolbar}>
        <Text style={styles.kicker}>Profile</Text>
        <Pressable accessibilityLabel="Settings" onPress={onOpenSettings} style={styles.iconButton}>
          <Ionicons name="settings-outline" size={21} color={colors.espresso} />
        </Pressable>
      </View>
      <View style={styles.passport}>
        <View style={styles.avatarRing}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{state.name.slice(0, 2).toUpperCase()}</Text></View>
        </View>
        <Text style={styles.name}>{state.name}</Text>
        <Text style={styles.handle}>LEVEL {level} · {state.profile.handle.toUpperCase()}</Text>
        <Text style={styles.progressText}>{state.profile.homeArea} · {state.profile.bio}</Text>
        <View style={styles.progress}><View style={[styles.progressFill, { width: `${(levelProgress / 250) * 100}%` }]} /></View>
        <Text style={styles.progressText}>{250 - levelProgress} XP to the next level</Text>
        <View style={styles.stats}>
          <View><Text style={styles.statValue}>{state.xp}</Text><Text style={styles.statLabel}>XP</Text></View>
          <View><Text style={styles.statValue}>{savedCount}</Text><Text style={styles.statLabel}>SAVED</Text></View>
          <View><Text style={styles.statValue}>{state.completedQuestIds.length}</Text><Text style={styles.statLabel}>QUESTS</Text></View>
        </View>
      </View>

      <Pressable onPress={onEditProfile} style={styles.editButton}>
        <Ionicons name="create-outline" size={18} color={colors.caramel} />
        <Text style={styles.editText}>Edit profile</Text>
      </Pressable>

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionLabel}>Achievements</Text>
        <Text style={styles.sectionCount}>{earnedAchievements.length} earned</Text>
      </View>
      <View style={styles.stamps}>
        {earnedAchievements.map((achievement, index) => (
          <View key={achievement.title} style={[styles.stamp, index === 1 && styles.stampSage]}>
            <Ionicons name={achievement.icon} size={21} color={index === 1 ? colors.sage : colors.caramel} />
            <Text style={styles.stampTitle}>{achievement.title}</Text>
            <Text style={styles.stampDetail}>{achievement.detail}</Text>
          </View>
        ))}
      </View>

      {state.reviews.length ? <View style={styles.actionRow}><View style={styles.actionIcon}><Ionicons name="chatbubble-ellipses-outline" size={21} color={colors.sage} /></View><View style={styles.actionCopy}><Text style={styles.actionTitle}>{state.reviews.length} vibe {state.reviews.length === 1 ? "check" : "checks"}</Text><Text style={styles.actionDetail}>{state.reviews.at(-1)?.note}</Text></View></View> : null}

      <Pressable onPress={onOpenSocial} style={styles.actionRow}>
        <View style={styles.actionIcon}><Ionicons name="people-outline" size={21} color={colors.sage} /></View>
        <View style={styles.actionCopy}><Text style={styles.actionTitle}>Friend activity</Text><Text style={styles.actionDetail}>Your local activity and sharing preferences.</Text></View>
        <Ionicons name="chevron-forward" size={19} color={colors.inkMuted} />
      </Pressable>
      <Pressable onPress={onOpenPlus} style={styles.plusCard}>
        <View><Text style={styles.plusKicker}>SIDEQUEST+</Text><Text style={styles.plusTitle}>Explore membership options.</Text><Text style={styles.plusLink}>See SIDEQUEST+</Text></View>
        <View style={styles.plusMark}><Ionicons name="sparkles" size={24} color={colors.crema} /></View>
      </Pressable>
      <Pressable onPress={onOpenSettings} style={styles.settingsButton}><Text style={styles.settingsText}>Settings</Text></Pressable>
    </Screen>
  );
}

const createStyles = (colors: AppPalette) => StyleSheet.create({
  toolbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  kicker: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 10, letterSpacing: 1 },
  iconButton: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, borderRadius: 15, backgroundColor: colors.paper },
  passport: { alignItems: "center", marginTop: 18, padding: 20, borderBottomWidth: 1, borderColor: colors.border, backgroundColor: colors.paper },
  avatarRing: { width: 72, height: 72, alignItems: "center", justifyContent: "center", borderRadius: 12 },
  avatar: { width: 64, height: 64, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: colors.brandSurface },
  avatarText: { color: colors.crema, fontFamily: typography.display, fontSize: 26 },
  name: { marginTop: 14, color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 26 },
  handle: { marginTop: 4, color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 9, letterSpacing: 1 },
  progress: { width: "100%", height: 8, overflow: "hidden", marginTop: 18, borderRadius: 5, backgroundColor: colors.caramelMist },
  progressFill: { height: "100%", borderRadius: 5, backgroundColor: colors.caramel },
  progressText: { marginTop: 7, color: colors.inkMuted, fontFamily: typography.body, fontSize: 9 },
  stats: { width: "100%", flexDirection: "row", justifyContent: "space-around", marginTop: 20, paddingTop: 17, borderTopWidth: 1, borderTopColor: colors.border },
  statValue: { color: colors.espresso, fontFamily: typography.displaySemibold, fontSize: 20, textAlign: "center" },
  statLabel: { marginTop: 3, color: colors.inkMuted, fontFamily: typography.bodyBold, fontSize: 8, letterSpacing: .8, textAlign: "center" },
  sectionHeading: { flexDirection: "row", justifyContent: "space-between", marginTop: 27, marginBottom: 11 },
  sectionLabel: { color: colors.inkMuted, fontFamily: typography.bodyBold, fontSize: 10, letterSpacing: 1 },
  sectionCount: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 10 },
  stamps: { gap: 8 },
  stamp: { minHeight: 80, padding: 12, borderBottomWidth: 1, borderColor: colors.border, backgroundColor: colors.paper },
  stampSage: { borderColor: colors.border },
  stampTitle: { marginTop: 8, color: colors.espresso, fontFamily: typography.displaySemibold, fontSize: 13 },
  stampDetail: { marginTop: 3, color: colors.inkMuted, fontFamily: typography.body, fontSize: 12, lineHeight: 18 },
  actionRow: { minHeight: 76, flexDirection: "row", alignItems: "center", gap: 12, marginTop: 22, padding: 13, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, backgroundColor: colors.paper },
  actionIcon: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 15, backgroundColor: colors.sageMist },
  actionCopy: { flex: 1 },
  actionTitle: { color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 12 },
  actionDetail: { marginTop: 3, color: colors.inkMuted, fontFamily: typography.body, fontSize: 10 },
  plusCard: { minHeight: 132, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12, padding: 18, borderRadius: radii.lg, backgroundColor: colors.brandSurface },
  plusKicker: { color: colors.crema, fontFamily: typography.bodyBold, fontSize: 9, letterSpacing: 1 },
  plusTitle: { maxWidth: 230, marginTop: 6, color: colors.white, fontFamily: typography.displaySemibold, fontSize: 19 },
  plusLink: { marginTop: 10, color: colors.crema, fontFamily: typography.bodyBold, fontSize: 11 },
  plusMark: { width: 62, height: 62, alignItems: "center", justifyContent: "center", borderWidth: 12, borderColor: "rgba(229,198,165,.16)", borderRadius: 31, backgroundColor: colors.caramel },
  settingsButton: { minHeight: 48, alignItems: "center", justifyContent: "center", marginTop: 12, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.paper },
  settingsText: { color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 12 },
  editButton: { minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 12, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.paper },
  editText: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 12 },
});
