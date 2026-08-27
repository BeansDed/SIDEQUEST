import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";

import { initialConsumerState } from "@/domain/catalog";
import { ConsumerProvider, useConsumer } from "@/state/consumer-provider";

import { DiscoveryScreen } from "./discovery-screen";
import { HomeScreen } from "./home-screen";
import { OnboardingScreen } from "./onboarding-screen";

function StateProbe() {
  const { state } = useConsumer();
  return <Text testID="state-probe">{state.onboarded ? `${state.name}:${state.preferences.vibes.join(",")}` : "not-ready"}</Text>;
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
    const view = await render(<ConsumerProvider initialState={{ ...initialConsumerState, hydrated: true, onboarded: true }}><HomeScreen onOpenCafe={() => undefined} onDiscover={() => undefined} /></ConsumerProvider>);
    expect(view.getByText("Soft Hours")).toBeTruthy();
    expect(view.getAllByText("100% match").length).toBeGreaterThan(0);
  });

  it("filters discovery and recovers from no matches", async () => {
    const view = await render(<ConsumerProvider initialState={{ ...initialConsumerState, hydrated: true, onboarded: true }}><DiscoveryScreen onOpenCafe={() => undefined} /></ConsumerProvider>);
    await fireEvent.press(view.getByText("garden"));
    expect(view.getByText("Morrow Coffee")).toBeTruthy();
    expect(view.queryByText("Soft Hours")).toBeNull();
    await fireEvent.press(view.getByText("Clear filters"));
    expect(view.getByText("Soft Hours")).toBeTruthy();
  });
});
