import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Share, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getCompletionFlow, type CompletionFlowTarget } from "@/domain/completion-flows";
import type { Profile, Settings } from "@/domain/types";
import { useConsumer } from "@/state/consumer-provider";
import { colors, radii, typography } from "@/theme/tokens";
import { useAppTheme } from "@/theme/app-theme";

const inputLabels: Record<string, string> = {
  "DISPLAY NAME": "Display name",
  HANDLE: "Handle",
  "HOME AREA": "Home area",
  BIO: "Bio",
};

export function CompletionFlowScreen({
  slug,
  onNavigate,
}: {
  slug: string | string[] | undefined;
  onNavigate(target: CompletionFlowTarget): void;
}) {
  const flow = getCompletionFlow(slug);
  const { colors: themedColors } = useAppTheme();
  const { state, updateProfile, updateSettings, updateSubscription, reset } = useConsumer();
  const [draftSettings, setDraftSettings] = useState<Settings>(state.settings);
  const [profile, setProfile] = useState<Profile>(state.profile);
  const [selection, setSelection] = useState(() => {
    if (flow.slug === "appearance") return state.settings.appearance;
    if (flow.slug === "language") return state.settings.language;
    if (flow.slug === "friend-visibility") return state.settings.socialVisibility;
    return flow.rows[0]?.value ?? "";
  });
  const [formValues, setFormValues] = useState<Record<string, string>>(() => Object.fromEntries(flow.rows.map((item) => [item.label, ""])));
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [validationError, setValidationError] = useState("");
  const palette = useMemo(() => ({
    canvas: themedColors.oat,
    surface: themedColors.paper,
    text: themedColors.espresso,
    muted: themedColors.inkMuted,
    border: themedColors.border,
  }), [themedColors]);

  const applySelection = () => {
    if (flow.slug === "appearance") updateSettings({ appearance: selection as Settings["appearance"] });
    if (flow.slug === "language") updateSettings({ language: selection as Settings["language"] });
    if (flow.slug === "friend-visibility") updateSettings({ socialVisibility: selection as Settings["socialVisibility"] });
  };

  const handlePrimary = async () => {
    if (flow.slug === "delete-confirmation" && deleteConfirmation !== "DELETE") {
      setValidationError("Type DELETE to confirm.");
      return;
    }
    if (flow.kind === "form") {
      const required = flow.rows.filter((item) => !item.settingKey).map((item) => [item.label, formValues[item.label]?.trim() ?? ""] as const);
      const email = required.find(([label]) => label === "EMAIL")?.[1];
      const password = required.find(([label]) => label === "PASSWORD")?.[1];
      const code = required.find(([label]) => label.includes("CODE"))?.[1];
      if (required.some(([, value]) => !value) || (email && !/^\S+@\S+\.\S+$/.test(email)) || (password && password.length < 8) || (code && code.replace(/\D/g, "").length !== 6)) {
        setValidationError("Complete every field with a valid email, an 8-character password, or a six-digit code where requested.");
        return;
      }
    }
    if (flow.kind === "toggles" || flow.rows.some((item) => item.settingKey)) updateSettings(draftSettings);
    if (flow.kind === "selection") applySelection();
    if (flow.kind === "profile") updateProfile(profile);
    if (flow.slug === "notification-primer") updateSettings({ notifications: true });
    if (flow.slug === "two-factor-enabled") updateSettings({ twoFactorEnabled: true });
    if (flow.slug === "trial-confirmed") updateSubscription("trial");
    if (flow.slug === "restore-success") updateSubscription("active");
    if (flow.slug === "cancellation-confirmed") updateSubscription("cancelled");
    if (flow.slug === "export-data") await Share.share({ title: "SIDEQUEST local data", message: JSON.stringify({ profile: state.profile, preferences: state.preferences, collections: state.collections, questHistory: state.questHistory, reviews: state.reviews }, null, 2) });
    if (flow.slug === "delete-confirmation") await reset();
    onNavigate(flow.slug === "appearance" ? "settings" : flow.next);
  };

  const renderProfileRow = (label: string) => {
    const key = label === "DISPLAY NAME" ? "displayName" : label === "HANDLE" ? "handle" : label === "HOME AREA" ? "homeArea" : "bio";
    return (
      <View key={label} style={[styles.field, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Text style={[styles.fieldLabel, { color: palette.muted }]}>{label}</Text>
        <TextInput
          accessibilityLabel={inputLabels[label]}
          multiline={key === "bio"}
          onChangeText={(value) => setProfile((current) => ({ ...current, [key]: value }))}
          style={[styles.fieldInput, { color: palette.text }]}
          value={profile[key]}
        />
      </View>
    );
  };

  const renderRow = (item: (typeof flow.rows)[number], index: number) => {
    if (flow.kind === "profile") return renderProfileRow(item.label);
    if (item.settingKey) {
      const key = item.settingKey as keyof Settings;
      const enabled = Boolean(draftSettings[key]);
      return (
        <View key={`${item.label}-${index}`} style={[styles.row, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.rowLabel, { color: palette.text }]}>{item.label}</Text>
          <Switch
            accessibilityLabel={item.label}
            accessibilityState={{ checked: enabled }}
            onValueChange={(value) => setDraftSettings((current) => ({ ...current, [key]: value }))}
            thumbColor={colors.paper}
            trackColor={{ false: colors.caramelMist, true: colors.caramel }}
            value={enabled}
          />
        </View>
      );
    }
    if (flow.kind === "selection") {
      const selected = selection === item.value;
      return (
        <Pressable
          accessibilityRole="radio"
          accessibilityState={{ selected }}
          key={`${item.label}-${index}`}
          onPress={() => setSelection(item.value ?? "")}
          style={[styles.row, { backgroundColor: palette.surface, borderColor: selected ? colors.caramel : palette.border }]}
        >
          <Text style={[styles.rowLabel, { color: palette.text }]}>{item.label}</Text>
          <Ionicons name={selected ? "radio-button-on" : "radio-button-off"} size={22} color={selected ? colors.caramel : palette.muted} />
        </Pressable>
      );
    }
    if (flow.kind === "form") {
      return (
        <View key={`${item.label}-${index}`} style={[styles.field, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.fieldLabel, { color: palette.muted }]}>{item.label}</Text>
          <TextInput
            accessibilityLabel={item.label.toLowerCase().replace(/(^|\s)\S/g, (letter) => letter.toUpperCase())}
            placeholder={item.value}
            placeholderTextColor={palette.muted}
            onChangeText={(value) => setFormValues((current) => ({ ...current, [item.label]: value }))}
            secureTextEntry={item.label === "PASSWORD"}
            style={[styles.fieldInput, { color: palette.text }]}
            value={formValues[item.label]}
          />
        </View>
      );
    }
    return (
      <View key={`${item.label}-${index}`} style={[styles.row, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <View style={styles.rowCopy}>
          <Text style={[styles.rowLabel, { color: palette.text }]}>{item.label}</Text>
          {item.value ? <Text style={[styles.rowValue, { color: palette.muted }]}>{item.value}</Text> : null}
        </View>
        <Ionicons name={flow.kind === "success" ? "checkmark-circle" : "ellipse"} size={flow.kind === "success" ? 22 : 7} color={flow.kind === "success" ? colors.sage : palette.muted} />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: palette.canvas }]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.phoneCanvas}>
          <Text style={styles.eyebrow}>{flow.eyebrow}</Text>
          <Text style={[styles.title, { color: palette.text }]}>{flow.title}</Text>
          <Text style={[styles.description, { color: palette.muted }]}>{flow.description}</Text>
          <View style={styles.rows}>{flow.rows.map(renderRow)}</View>
          {flow.slug === "delete-confirmation" ? (
            <View style={[styles.field, { marginTop: 12, backgroundColor: palette.surface, borderColor: validationError ? colors.danger : palette.border }]}>
              <Text style={[styles.fieldLabel, { color: palette.muted }]}>TYPE DELETE TO CONFIRM</Text>
              <TextInput
                accessibilityLabel="Delete confirmation"
                autoCapitalize="characters"
                onChangeText={(value) => { setDeleteConfirmation(value); setValidationError(""); }}
                style={[styles.fieldInput, { color: palette.text }]}
                value={deleteConfirmation}
              />
            </View>
          ) : null}
          {validationError ? <Text style={styles.validationError}>{validationError}</Text> : null}
          {flow.kind === "subscription" ? (
            <View style={[styles.honesty, { borderColor: palette.border }]}>
              <Ionicons name="information-circle-outline" size={19} color={colors.caramel} />
              <Text style={[styles.honestyText, { color: palette.muted }]}>Demo plan only. No store charge or payment request is made.</Text>
            </View>
          ) : null}
          <View style={styles.actions}>
            <Pressable accessibilityRole="button" onPress={handlePrimary} style={[styles.primary, flow.kind === "danger" && styles.danger]}>
              <Text style={styles.primaryText}>{flow.actionLabel}</Text>
            </Pressable>
            {flow.secondaryLabel && flow.secondaryNext ? (
              <Pressable accessibilityRole="button" onPress={() => onNavigate(flow.secondaryNext!)} style={styles.secondary}>
                <Text style={styles.secondaryText}>{flow.secondaryLabel} →</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 1 },
  phoneCanvas: { width: "100%", maxWidth: 430, minHeight: 780, alignSelf: "center", paddingHorizontal: 24, paddingTop: 30, paddingBottom: 28 },
  eyebrow: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 11, letterSpacing: 1 },
  title: { maxWidth: 350, marginTop: 16, fontFamily: typography.display, fontSize: 34, lineHeight: 39 },
  description: { maxWidth: 350, marginTop: 16, fontFamily: typography.body, fontSize: 14, lineHeight: 21 },
  rows: { gap: 10, marginTop: 28 },
  row: { minHeight: 58, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, paddingHorizontal: 16, paddingVertical: 11, borderWidth: 1, borderRadius: radii.md },
  rowCopy: { flex: 1 },
  rowLabel: { flexShrink: 1, fontFamily: typography.bodyBold, fontSize: 14 },
  rowValue: { marginTop: 3, fontFamily: typography.body, fontSize: 11 },
  field: { minHeight: 64, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8, borderWidth: 1, borderRadius: radii.md },
  fieldLabel: { fontFamily: typography.bodyBold, fontSize: 10 },
  fieldInput: { minHeight: 32, padding: 0, fontFamily: typography.body, fontSize: 14 },
  honesty: { flexDirection: "row", gap: 9, marginTop: 14, padding: 13, borderWidth: 1, borderRadius: radii.md },
  honestyText: { flex: 1, fontFamily: typography.body, fontSize: 11, lineHeight: 16 },
  actions: { marginTop: "auto", paddingTop: 34 },
  primary: { minHeight: 58, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: colors.caramel },
  danger: { backgroundColor: colors.danger },
  primaryText: { color: colors.white, fontFamily: typography.bodyBold, fontSize: 15 },
  secondary: { minHeight: 48, alignItems: "center", justifyContent: "center", marginTop: 4 },
  secondaryText: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 13 },
  validationError: { marginTop: 8, color: colors.danger, fontFamily: typography.bodyBold, fontSize: 11 },
});
