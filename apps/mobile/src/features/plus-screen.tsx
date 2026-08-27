import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/screen";
import { colors, radii, typography } from "@/theme/tokens";

const benefits = [
  "More themed quest packs",
  "Unlimited shared collections",
  "Offline neighborhood guides",
  "Seasonal passport stamps",
];

export function PlusScreen() {
  const [previewed, setPreviewed] = useState(false);

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={styles.mark}><Ionicons name="sparkles" size={33} color={colors.crema} /></View>
        <Text style={styles.kicker}>SIDEQUEST+</Text>
        <Text style={styles.title}>More reasons to leave the group chat.</Text>
        <Text style={styles.subtitle}>A product preview for the capstone demo. No payment is taken.</Text>
      </View>
      <View style={styles.priceCard}>
        <Text style={styles.plan}>MONTHLY DEMO PLAN</Text>
        <View style={styles.priceLine}><Text style={styles.price}>₱149</Text><Text style={styles.period}> / month</Text></View>
        <Text style={styles.planNote}>Illustrative pricing · cancel anytime if billing is added later</Text>
        <View style={styles.benefits}>
          {benefits.map((benefit) => (
            <View key={benefit} style={styles.benefit}>
              <Ionicons name="checkmark-circle" size={19} color={colors.sage} />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
      </View>
      {previewed ? (
        <View style={styles.demoNotice}>
          <Ionicons name="information-circle-outline" size={22} color={colors.caramel} />
          <View style={styles.noticeCopy}>
            <Text style={styles.noticeTitle}>Checkout is not connected in this demo.</Text>
            <Text style={styles.noticeText}>Production billing would require store products, verified receipts, and account entitlements.</Text>
          </View>
        </View>
      ) : null}
      <Pressable onPress={() => setPreviewed(true)} style={styles.primary}>
        <Text style={styles.primaryText}>Preview membership</Text>
      </Pressable>
      <Pressable onPress={() => setPreviewed(true)} style={styles.restore}>
        <Text style={styles.restoreText}>Restore purchase demo</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: "center", paddingVertical: 28, paddingHorizontal: 18, borderRadius: radii.xl, backgroundColor: colors.espresso },
  mark: { width: 92, height: 92, alignItems: "center", justifyContent: "center", borderWidth: 22, borderColor: "rgba(229,198,165,.16)", borderRadius: 46, backgroundColor: colors.caramel },
  kicker: { marginTop: 18, color: colors.crema, fontFamily: typography.bodyBold, fontSize: 10, letterSpacing: 1.3 },
  title: { maxWidth: 320, marginTop: 8, color: colors.white, fontFamily: typography.display, fontSize: 34, lineHeight: 38, textAlign: "center" },
  subtitle: { maxWidth: 290, marginTop: 9, color: "rgba(255,255,255,.66)", fontFamily: typography.body, fontSize: 11, lineHeight: 17, textAlign: "center" },
  priceCard: { marginTop: 16, padding: 19, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, backgroundColor: colors.paper },
  plan: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 9, letterSpacing: 1 },
  priceLine: { flexDirection: "row", alignItems: "baseline", marginTop: 6 },
  price: { color: colors.espresso, fontFamily: typography.display, fontSize: 38 },
  period: { color: colors.inkMuted, fontFamily: typography.bodyMedium, fontSize: 12 },
  planNote: { marginTop: 3, color: colors.inkMuted, fontFamily: typography.body, fontSize: 9 },
  benefits: { gap: 11, marginTop: 20, paddingTop: 17, borderTopWidth: 1, borderTopColor: colors.border },
  benefit: { flexDirection: "row", alignItems: "center", gap: 9 },
  benefitText: { color: colors.espresso, fontFamily: typography.bodyMedium, fontSize: 11 },
  demoNotice: { flexDirection: "row", gap: 10, marginTop: 14, padding: 14, borderRadius: radii.md, backgroundColor: colors.caramelMist },
  noticeCopy: { flex: 1 },
  noticeTitle: { color: colors.espresso, fontFamily: typography.bodyBold, fontSize: 11 },
  noticeText: { marginTop: 3, color: colors.inkMuted, fontFamily: typography.body, fontSize: 9, lineHeight: 14 },
  primary: { minHeight: 54, alignItems: "center", justifyContent: "center", marginTop: 14, borderRadius: radii.md, backgroundColor: colors.espresso },
  primaryText: { color: colors.white, fontFamily: typography.bodyBold, fontSize: 13 },
  restore: { minHeight: 48, alignItems: "center", justifyContent: "center", marginTop: 8 },
  restoreText: { color: colors.caramel, fontFamily: typography.bodyBold, fontSize: 11 },
});
