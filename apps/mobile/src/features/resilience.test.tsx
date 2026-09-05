import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";

import { cafes, initialConsumerState } from "@/domain/catalog";
import { CafeProvider } from "@/data/cafe-provider";
import { ConsumerProvider, useConsumer } from "@/state/consumer-provider";
import { ErrorBoundary } from "@/components/error-boundary";

import { NotFoundScreen } from "./not-found-screen";
import { PlusScreen } from "./plus-screen";
import { ProfileScreen } from "./profile-screen";
import { SettingsScreen } from "./settings-screen";
import { SavedScreen } from "./saved-screen";
import { SocialScreen } from "./social-screen";

function StateProbe() {
  const { state } = useConsumer();
  return (
    <Text testID="settings-probe">
      {`${state.name}:${state.settings.notifications}:${state.settings.socialVisibility}`}
    </Text>
  );
}

function BrokenScreen(): never {
  throw new Error("render failed");
}

function CafeFixture({ children }: { children: React.ReactNode }) {
  return <CafeProvider apiBaseUrl="https://test.invalid" locationClient={{ requestPermission: async () => ({ granted: true, canAskAgain: true }), getPosition: async () => ({ latitude: 14.56, longitude: 121.02 }) }} loadCafes={async () => cafes}>{children}</CafeProvider>;
}

let shouldFailOnce = true;
function RecoverableScreen() {
  if (shouldFailOnce) throw new Error("temporary render failure");
  return <Text>Recovered screen</Text>;
}

describe("native profile and resilient states", () => {
  it("shows the friends-only privacy default and persists settings changes", async () => {
    const view = await render(
      <ConsumerProvider initialState={{ ...initialConsumerState, hydrated: true }}>
        <SettingsScreen />
        <StateProbe />
      </ConsumerProvider>,
    );

    expect(view.getByText("Friends only")).toBeTruthy();
    await fireEvent(view.getByLabelText("Quest and café reminders"), "valueChange", false);
    await fireEvent.press(view.getByText("Private"));

    await waitFor(() => {
      expect(view.getByTestId("settings-probe").props.children).toBe("Mika:false:private");
    });
  }, 30000);

  it("requires confirmation before resetting demo data", async () => {
    const view = await render(
      <ConsumerProvider initialState={{ ...initialConsumerState, hydrated: true, name: "Ada" }}>
        <SettingsScreen />
        <StateProbe />
      </ConsumerProvider>,
    );

    await fireEvent.press(view.getByText("Reset demo data"));
    expect(view.getByText("Reset everything?")).toBeTruthy();
    expect(view.getByTestId("settings-probe").props.children).toBe("Ada:true:friends");

    await fireEvent.press(view.getByText("Keep my data"));
    expect(view.queryByText("Reset everything?")).toBeNull();
    expect(view.getByTestId("settings-probe").props.children).toBe("Ada:true:friends");

    await fireEvent.press(view.getByText("Reset demo data"));
    await fireEvent.press(view.getByText("Reset everything"));

    await waitFor(() => {
      expect(view.getByTestId("settings-probe").props.children).toBe("Mika:true:friends");
    });
  }, 30000);

  it("exposes profile destinations through real controls", async () => {
    const onOpenSettings = jest.fn();
    const onOpenPlus = jest.fn();
    const onOpenSocial = jest.fn();
    const onEditProfile = jest.fn();
    const view = await render(
      <ConsumerProvider initialState={{ ...initialConsumerState, hydrated: true }}>
        <ProfileScreen
          onOpenSettings={onOpenSettings}
          onOpenPlus={onOpenPlus}
          onOpenSocial={onOpenSocial}
          onEditProfile={onEditProfile}
        />
      </ConsumerProvider>,
    );

    await fireEvent.press(view.getByText("Settings"));
    await fireEvent.press(view.getByText("See SIDEQUEST+"));
    await fireEvent.press(view.getByText("Friend activity"));
    await fireEvent.press(view.getByText("Edit profile"));

    expect(onOpenSettings).toHaveBeenCalledTimes(1);
    expect(onOpenPlus).toHaveBeenCalledTimes(1);
    expect(onOpenSocial).toHaveBeenCalledTimes(1);
    expect(onEditProfile).toHaveBeenCalledTimes(1);
  }, 30000);

  it("opens the completed preference, privacy, security, and support flows from settings", async () => {
    const onOpenFlow = jest.fn();
    const view = await render(
      <ConsumerProvider initialState={{ ...initialConsumerState, hydrated: true }}>
        <SettingsScreen onOpenFlow={onOpenFlow} />
      </ConsumerProvider>,
    );

    await fireEvent.press(view.getByText("Accessibility"));
    await fireEvent.press(view.getByText("Privacy & safety"));
    await fireEvent.press(view.getByText("Two-factor security"));
    await fireEvent.press(view.getByText("Help & support"));

    expect(onOpenFlow).toHaveBeenNthCalledWith(1, "accessibility");
    expect(onOpenFlow).toHaveBeenNthCalledWith(2, "privacy-controls");
    expect(onOpenFlow).toHaveBeenNthCalledWith(3, "two-factor-setup");
    expect(onOpenFlow).toHaveBeenNthCalledWith(4, "help-center");
  }, 30000);

  it("opens real local subscription management from Plus", async () => {
    const onManagePlan = jest.fn();
    const view = await render(<PlusScreen onManagePlan={onManagePlan} />);

    await fireEvent.press(view.getByText("Manage demo plan"));

    expect(onManagePlan).toHaveBeenCalledTimes(1);
  }, 30000);

  it("returns home from an unknown route", async () => {
    const onReturnHome = jest.fn();
    const view = await render(<NotFoundScreen onReturnHome={onReturnHome} />);

    await fireEvent.press(view.getByText("Return home"));

    expect(onReturnHome).toHaveBeenCalledTimes(1);
  }, 30000);

  it("hides friend activity when the profile is private", async () => {
    const view = await render(
      <ConsumerProvider
        initialState={{
          ...initialConsumerState,
          hydrated: true,
          settings: { ...initialConsumerState.settings, socialVisibility: "private" },
        }}
      >
        <SocialScreen />
      </ConsumerProvider>,
    );

    expect(view.getByText("Your activity is private.")).toBeTruthy();
    expect(view.queryByText("Bea found a quiet window seat.")).toBeNull();
  }, 30000);

  it("labels Plus checkout as an unconnected demo", async () => {
    const view = await render(<PlusScreen />);

    await fireEvent.press(view.getByText("Preview membership"));

    expect(view.getByText("Checkout is not connected in this demo.")).toBeTruthy();
  }, 30000);

  it("offers a route home when a screen crashes", async () => {
    const onReturnHome = jest.fn();
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const warningSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    const view = await render(
      <ErrorBoundary onReturnHome={onReturnHome}>
        <BrokenScreen />
      </ErrorBoundary>,
    );

    expect(view.getByText("This screen lost the trail.")).toBeTruthy();
    await fireEvent.press(view.getByText("Return home"));

    expect(onReturnHome).toHaveBeenCalledTimes(1);
    consoleSpy.mockRestore();
    warningSpy.mockRestore();
  }, 30000);

  it("retries a screen after a transient render error", async () => {
    shouldFailOnce = true;
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const warningSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    const view = await render(
      <ErrorBoundary onReturnHome={() => undefined}>
        <RecoverableScreen />
      </ErrorBoundary>,
    );

    shouldFailOnce = false;
    await fireEvent.press(view.getByText("Retry"));

    expect(view.getByText("Recovered screen")).toBeTruthy();
    consoleSpy.mockRestore();
    warningSpy.mockRestore();
  }, 30000);

  it("requires confirmation before deleting a collection", async () => {
    const state = { ...initialConsumerState, hydrated: true, collections: [
      { id: "first", name: "Quiet resets", cafeIds: [], visibility: "private" as const },
      { id: "date", name: "Date ideas", cafeIds: ["soft-hours", "morrow-coffee"], visibility: "private" as const },
    ] };
    const view = await render(<ConsumerProvider initialState={state}><CafeFixture><SavedScreen onOpenCafe={() => undefined} /></CafeFixture></ConsumerProvider>);

    await fireEvent.press(view.getByLabelText("Delete Date ideas"));
    expect(view.getByText("Delete Date ideas?")).toBeTruthy();
    expect(view.getByText("2 saved cafés will return to your other collections when applicable.")).toBeTruthy();
    await fireEvent.press(view.getByText("Keep collection"));
    expect(view.queryByText("Delete Date ideas?")).toBeNull();
  });

  it("exposes save and cancel while renaming a collection", async () => {
    const state = { ...initialConsumerState, hydrated: true, collections: [
      initialConsumerState.collections[0],
      { id: "date", name: "Date ideas", cafeIds: [], visibility: "private" as const },
    ] };
    const view = await render(<ConsumerProvider initialState={state}><CafeFixture><SavedScreen onOpenCafe={() => undefined} /></CafeFixture></ConsumerProvider>);

    await fireEvent.press(view.getByLabelText("Rename Date ideas"));
    expect(view.getByLabelText("Save Date ideas name")).toBeTruthy();
    expect(view.getByLabelText("Cancel Date ideas rename")).toBeTruthy();
  });
});
