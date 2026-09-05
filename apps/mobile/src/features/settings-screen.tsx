import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { Screen } from "@/components/screen";
import type { CompletionFlowSlug } from "@/domain/completion-flows";
import { useConsumer } from "@/state/consumer-provider";
import { useAppTheme, type AppPalette } from "@/theme/app-theme";
import { radii, typography } from "@/theme/tokens";

function SettingRow({
  icon,
  title,
  description,
  control,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  control: React.ReactNode;
}) {
  const { colors } = useAppTheme(); const styles = createStyles(colors);
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={20} color={colors.caramel} />
      </View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      {control}
    </View>
  );
}

const destinations: { title: string; description: string; icon: keyof typeof Ionicons.glyphMap; slug: CompletionFlowSlug }[] = [
  { title: "Notification preferences", description: "Café, quest, friend, and weekly updates.", icon: "notifications-outline", slug: "notification-preferences" },
  { title: "Appearance", description: "Light, dark, or your device setting.", icon: "moon-outline", slug: "appearance" },
  { title: "Language & region", description: "Language and local display formats.", icon: "language-outline", slug: "language" },
  { title: "Sound & haptics", description: "App sounds and touch feedback.", icon: "volume-medium-outline", slug: "sound-haptics" },
  { title: "Accessibility", description: "Text, contrast, motion, and assistive labels.", icon: "accessibility-outline", slug: "accessibility" },
  { title: "Privacy & safety", description: "Location, analytics, and suggestions.", icon: "shield-checkmark-outline", slug: "privacy-controls" },
  { title: "Two-factor security", description: "Authenticator and recovery codes.", icon: "key-outline", slug: "two-factor-setup" },
  { title: "Export my data", description: "Prepare a portable demo export.", icon: "download-outline", slug: "export-data" },
  { title: "Delete account", description: "Review permanent local deletion.", icon: "trash-outline", slug: "delete-account" },
  { title: "Help & support", description: "FAQs, contact, and safety reporting.", icon: "help-circle-outline", slug: "help-center" },
];

export function SettingsScreen({ onOpenFlow }: { onOpenFlow?(slug: CompletionFlowSlug): void } = {}) {
  const { colors } = useAppTheme(); const styles = createStyles(colors);
  const { state, updateSettings, reset } = useConsumer();
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <Screen>
      <Text style={styles.kicker}>YOUR SPACE</Text>
      <Text style={styles.title}>Settings that stay out of the way.</Text>
      {state.persistenceWarning ? (
        <View style={styles.warning}>
          <Ionicons name="cloud-offline-outline" size={18} color={colors.danger} />
          <Text style={styles.warningText}>{state.persistenceWarning}</Text>
        </View>
      ) : null}

      <Text style={styles.sectionLabel}>NOTIFICATIONS & COMFORT</Text>
      <View style={styles.card}>
        <SettingRow
          icon="notifications-outline"
          title="Quest and café reminders"
          description="Local demo preference; no push service is connected."
          control={(
            <Switch
              accessibilityLabel="Quest and café reminders"
              value={state.settings.notifications}
              onValueChange={(notifications) => updateSettings({ notifications })}
              trackColor={{ false: colors.border, true: colors.sage }}
              thumbColor={colors.paper}
            />
          )}
        />
        <SettingRow
          icon="accessibility-outline"
          title="Reduced motion"
          description="Keeps transitions calm and removes decorative movement."
          control={(
            <Switch
              accessibilityLabel="Reduced motion"
              value={state.settings.reducedMotion}
              onValueChange={(reducedMotion) => updateSettings({ reducedMotion })}
              trackColor={{ false: colors.border, true: colors.sage }}
              thumbColor={colors.paper}
            />
          )}
        />
      </View>

      <Text style={styles.sectionLabel}>SOCIAL VISIBILITY</Text>
      <View style={styles.privacyCard}>
        <View style={styles.privacyHeading}>
          <Ionicons name="people-outline" size={22} color={colors.sage} />
          <View style={styles.rowCopy}>
            <Text style={styles.rowTitle}>Who sees your activity</Text>
            <Text style={styles.rowDescription}>Friends only is the safer default.</Text>
          </View>
        </View>
        <View style={styles.segmented}>
          {(["friends", "private"] as const).map((visibility) => {
            const selected = state.settings.socialVisibility === visibility;
            return (
              <Pressable
                key={visibility}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => updateSettings({ socialVisibility: visibility })}
                style={[styles.segment, selected && styles.segmentSelected]}
              >
                <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>
                  {visibility === "friends" ? "Friends only" : "Private"}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Text style={styles.sectionLabel}>LOCATION & DATA</Text>
      <View style={styles.note}>
        <Ionicons name="location-outline" size={21} color={colors.caramel} />
        <Text style={styles.noteText}>
          Location is optional. SIDEQUEST keeps manual Makati discovery available and never tracks you in the background.
        </Text>
      </View>

      <Text style={styles.sectionLabel}>MORE CONTROLS</Text>
      <View style={styles.linkCard}>
        {destinations.map((destination) => (
          <Pressable key={destination.slug} onPress={() => onOpenFlow?.(destination.slug)} style={styles.linkRow}>
            <View style={styles.rowIcon}>
              <Ionicons name={destination.icon} size={20} color={destination.slug === "delete-account" ? colors.danger : colors.caramel} />
            </View>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>{destination.title}</Text>
              <Text style={styles.rowDescription}>{destination.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.inkMuted} />
          </Pressable>
        ))}
      </View>

      {confirmingReset ? (
        <View style={styles.resetConfirm}>
          <Text style={styles.resetTitle}>Reset everything?</Text>
          <Text style={styles.rowDescription}>This clears local preferences, saved cafés, reviews, and quest progress.</Text>
          <View style={styles.resetActions}>
            <Pressable onPress={() => setConfirmingReset(false)} style={styles.secondaryButton}>
              <Text style={styles.secondaryText}>Keep my data</Text>
            </Pressable>
            <Pressable onPress={() => void reset().then(() => setConfirmingReset(false))} style={styles.dangerButton}>
              <Text style={styles.dangerText}>Reset everything</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable onPress={() => setConfirmingReset(true)} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Reset demo data</Text>
        </Pressable>
      )}
    </Screen>
  );
}

const createStyles = (colors: AppPalette) => StyleSheet.create({
  kicker: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 10, letterSpacing: 1 },
  title: { maxWidth: 330, marginTop: 8, color: colors.espresso, fontFamily: typography.display, fontSize: 34, lineHeight: 38 },
  warning: { flexDirection: "row", gap: 10, marginTop: 16, padding: 13, borderRadius: radii.md, backgroundColor: "#F8E7E1" },
  warningText: { flex: 1, color: colors.danger, fontFamily: typography.bodyMedium, fontSize: 10, lineHeight: 15 },
  sectionLabel: { marginTop: 28, marginBottom: 10, color: colors.inkMuted, fontFamily: typography.bodyBold, fontSize: 10, letterSpacing: 1 },
  card: { overflow: "hidden", borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, backgroundColor: colors.paper },
  row: { minHeight: 88, flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  rowIcon: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: colors.caramelMist },
  rowCopy: { flex: 1 },
  rowTitle: { color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 12 },
  rowDescription: { marginTop: 3, color: colors.inkMuted, fontFamily: typography.body, fontSize: 10, lineHeight: 15 },
  privacyCard: { padding: 16, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, backgroundColor: colors.paper },
  privacyHeading: { flexDirection: "row", alignItems: "center", gap: 12 },
  segmented: { flexDirection: "row", gap: 6, marginTop: 14, padding: 4, borderRadius: 14, backgroundColor: colors.oat },
  segment: { minHeight: 44, flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 11 },
  segmentSelected: { backgroundColor: colors.brandSurface },
  segmentText: { color: colors.inkMuted, fontFamily: typography.bodyBold, fontSize: 11 },
  segmentTextSelected: { color: colors.white },
  note: { flexDirection: "row", gap: 10, padding: 15, borderRadius: radii.md, backgroundColor: colors.caramelMist },
  noteText: { flex: 1, color: colors.inkMuted, fontFamily: typography.body, fontSize: 11, lineHeight: 17 },
  resetButton: { minHeight: 50, alignItems: "center", justifyContent: "center", marginTop: 22, borderWidth: 1, borderColor: colors.danger, borderRadius: radii.md },
  resetButtonText: { color: colors.danger, fontFamily: typography.bodyBold, fontSize: 12 },
  resetConfirm: { marginTop: 22, padding: 18, borderWidth: 1, borderColor: colors.danger, borderRadius: radii.lg, backgroundColor: colors.paper },
  resetTitle: { color: colors.espresso, fontFamily: typography.displaySemibold, fontSize: 22 },
  resetActions: { flexDirection: "row", gap: 8, marginTop: 16 },
  secondaryButton: { minHeight: 48, flex: 1, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, borderRadius: radii.md },
  secondaryText: { color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 11 },
  dangerButton: { minHeight: 48, flex: 1, alignItems: "center", justifyContent: "center", borderRadius: radii.md, backgroundColor: colors.danger },
  dangerText: { color: colors.white, fontFamily: typography.bodyBold, fontSize: 11 },
  linkCard: { overflow: "hidden", borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, backgroundColor: colors.paper },
  linkRow: { minHeight: 76, flexDirection: "row", alignItems: "center", gap: 12, padding: 13, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
});
