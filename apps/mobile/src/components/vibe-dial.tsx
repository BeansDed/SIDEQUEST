import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Vibe } from "@/domain/types";
import { useAppTheme, type AppPalette } from "@/theme/app-theme";
import { typography } from "@/theme/tokens";

const vibes: Vibe[] = ["quiet", "warm", "creative", "garden", "minimal", "lively"];

export function VibeDial({ selected, onToggle }: { selected: Vibe[]; onToggle(vibe: Vibe): void }) {
  const { colors } = useAppTheme(); const styles = createStyles(colors);
  return <View style={styles.wrap}><View style={styles.ring}><Text style={styles.small}>SET THE</Text><Text style={styles.word}>vibe</Text></View><View style={styles.options}>{vibes.map((vibe) => <Pressable key={vibe} onPress={() => onToggle(vibe)} style={[styles.option, selected.includes(vibe) && styles.active]}><Text style={[styles.label, selected.includes(vibe) && styles.activeLabel]}>{vibe}</Text></Pressable>)}</View></View>;
}

const createStyles = (colors: AppPalette) => StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 16, padding: 16, borderRadius: 24, backgroundColor: colors.brandSurface },
  ring: { width: 86, height: 86, alignItems: "center", justifyContent: "center", borderWidth: 14, borderColor: "rgba(229,198,165,.28)", borderRadius: 43, backgroundColor: colors.caramel },
  small: { color: colors.white, fontFamily: typography.bodyBold, fontSize: 7, letterSpacing: 1 },
  word: { color: colors.white, fontFamily: typography.display, fontSize: 20 },
  options: { flex: 1, flexDirection: "row", flexWrap: "wrap", gap: 7 },
  option: { minHeight: 36, justifyContent: "center", paddingHorizontal: 11, borderWidth: 1, borderColor: "rgba(255,255,255,.2)", borderRadius: 18 },
  active: { borderColor: colors.crema, backgroundColor: colors.crema },
  label: { color: "rgba(255,255,255,.72)", fontFamily: typography.bodyMedium, fontSize: 10 },
  activeLabel: { color: colors.espresso, fontFamily: typography.bodyBold },
});
