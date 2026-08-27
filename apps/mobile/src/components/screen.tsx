import type { PropsWithChildren, ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/theme/tokens";

export function Screen({ children, scroll = true, footer }: PropsWithChildren<{ scroll?: boolean; footer?: ReactNode }>) {
  const content = <View style={styles.content}>{children}</View>;
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      {scroll ? <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>{content}</ScrollView> : content}
      {footer}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.oat },
  scroll: { flexGrow: 1, paddingBottom: 120 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 18 },
});
