import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";

import { CafeProvider } from "@/data/cafe-provider";
import { cafes, initialConsumerState } from "@/domain/catalog";
import { ConsumerProvider, useConsumer } from "@/state/consumer-provider";

import { DiscoveryScreen } from "./discovery-screen";
import { HomeScreen } from "./home-screen";
import { OnboardingScreen } from "./onboarding-screen";

function StateProbe() {
  const { state } = useConsumer();
  return <Text testID="state-probe">{state.onboarded ? `${state.name}:${state.preferences.vibes.join(",")}` : "not-ready"}</Text>;
}

function LiveCafeFixture({ children }: { children: React.ReactNode }) {
  return <CafeProvider apiBaseUrl="https://test.invalid" locationClient={{ requestPermission: async () => ({ granted: true, canAskAgain: true }), getPosition: async () => ({ latitude: 14.56, longitude: 121.02 }) }} loadCafes={async () => cafes}>{children}</CafeProvider>;
}

describe("native core flow", () => {
  it("saves onboarding preferences and enters the app", async () => {
    const view = await render(<ConsumerProvider initialState={{ ...initialConsumerState, hydrated: true }}><OnboardingScreen onDone={() => undefined} /><StateProbe /></ConsumerProvider>);
    await fireEvent.changeText(view.getByPlaceholderText("What should we call you?"), "Kai");
    await fireEvent.press(view.getByText("garden"));
    await fireEvent.press(view.getByText("Start exploring"));
    expect(view.getByTestId("state-probe").props.children).toContain("Kai");
    expect(view.getByTestId("state-probe").props.children).toContain("garden");
  }, 30000);

  it("shows the strongest café match on Home", async () => {
    const view = await render(<ConsumerProvider initialState={{ ...initialConsumerState, hydrated: true, onboarded: true }}><LiveCafeFixture><HomeScreen onOpenCafe={() => undefined} onDiscover={() => undefined} /></LiveCafeFixture></ConsumerProvider>);
    await waitFor(() => expect(view.getByText("Soft Hours")).toBeTruthy());
    expect(view.getAllByText("100% match").length).toBeGreaterThan(0);
  });

  it("filters discovery and recovers from no matches", async () => {
    const view = await render(<ConsumerProvider initialState={{ ...initialConsumerState, hydrated: true, onboarded: true }}><LiveCafeFixture><DiscoveryScreen onOpenCafe={() => undefined} /></LiveCafeFixture></ConsumerProvider>);
    await waitFor(() => expect(view.getByText("Soft Hours")).toBeTruthy());
    expect(view.queryByText("garden")).toBeNull();
    await fireEvent.press(view.getByText("More filters"));
    await fireEvent.press(view.getByText("garden"));
    expect(view.getByText("Morrow Coffee")).toBeTruthy();
    expect(view.queryByText("Soft Hours")).toBeNull();
    await fireEvent.press(view.getByText("Fewer filters"));
    expect(view.queryByText("garden")).toBeNull();
    expect(view.getByText("Morrow Coffee")).toBeTruthy();
    await fireEvent.press(view.getByText("Clear filters"));
    expect(view.getByText("Soft Hours")).toBeTruthy();
  });

  it("shows useful status and recent destinations", async () => {
    const state = { ...initialConsumerState, hydrated: true, onboarded: true, recentCafeIds: ["soft-hours"], activeQuestId: "study-sprint" };
    const view = await render(<ConsumerProvider initialState={state}><LiveCafeFixture><HomeScreen onOpenCafe={() => undefined} onDiscover={() => undefined} /></LiveCafeFixture></ConsumerProvider>);

    await waitFor(() => expect(view.getByText("OPEN NOW")).toBeTruthy());
    expect(view.getByText("RECENTLY VIEWED")).toBeTruthy();
    expect(view.getAllByText("Soft Hours").length).toBeGreaterThan(1);
    expect(view.getByText("ACTIVE STEP")).toBeTruthy();
  });

  it("filters discovery by visit intent and clears the summary", async () => {
    const view = await render(<ConsumerProvider initialState={{ ...initialConsumerState, hydrated: true, onboarded: true }}><LiveCafeFixture><DiscoveryScreen onOpenCafe={() => undefined} /></LiveCafeFixture></ConsumerProvider>);
    await waitFor(() => expect(view.getByText("Soft Hours")).toBeTruthy());

    await fireEvent.press(view.getByLabelText("Study intent"));
    expect(view.getByText("STUDY INTENT")).toBeTruthy();
    await fireEvent.press(view.getByText("Reset all"));
    expect(view.queryByText("Reset all")).toBeNull();
  });
});
