import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
  useFonts as useDMSans,
} from "@expo-google-fonts/dm-sans";
import {
  Fraunces_600SemiBold,
  Fraunces_700Bold,
  useFonts as useFraunces,
} from "@expo-google-fonts/fraunces";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { BrandedLoading } from "@/components/branded-loading";
import { ErrorBoundary } from "@/components/error-boundary";
import { ConsumerProvider, useConsumer } from "@/state/consumer-provider";
import { CafeProvider } from "@/data/cafe-provider";
import { AppThemeProvider, useAppTheme } from "@/theme/app-theme";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [dmLoaded] = useDMSans({ DMSans_400Regular, DMSans_500Medium, DMSans_700Bold });
  const [frauncesLoaded] = useFraunces({ Fraunces_600SemiBold, Fraunces_700Bold });
  const ready = dmLoaded && frauncesLoaded;

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return <BrandedLoading />;

  return <ConsumerProvider><AppThemeProvider><AppShell /></AppThemeProvider></ConsumerProvider>;
}

function AppShell() {
  const { state } = useConsumer();
  const { appearance, colors } = useAppTheme();
  return <>
    <StatusBar style={appearance === "dark" ? "light" : "dark"} backgroundColor={colors.paper} />
    <CafeProvider enabled={state.hydrated && state.onboarded && state.settings.preciseLocation}>
      <ErrorBoundary onReturnHome={() => router.replace("/(tabs)")}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper } }} />
      </ErrorBoundary>
    </CafeProvider>
  </>;
}
