import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";

import { initialConsumerState } from "@/domain/catalog";
import { ConsumerProvider, useConsumer } from "@/state/consumer-provider";

import { CompletionFlowScreen } from "./completion-flow-screen";

function StateProbe() {
  const { state } = useConsumer();
  return (
    <Text testID="completion-state">
      {JSON.stringify({ profile: state.profile, settings: state.settings, subscriptionStatus: state.subscriptionStatus })}
    </Text>
  );
}

describe("Figma completion flow screen", () => {
  it("saves the accessibility switches to consumer state", async () => {
    const view = await render(
      <ConsumerProvider initialState={{ ...initialConsumerState, hydrated: true }}>
        <CompletionFlowScreen slug="accessibility" onNavigate={() => undefined} />
        <StateProbe />
      </ConsumerProvider>,
    );

    await fireEvent(view.getByLabelText("Larger text"), "valueChange", true);
    await fireEvent(view.getByLabelText("High contrast"), "valueChange", true);
    await fireEvent.press(view.getByText("Save accessibility"));

    await waitFor(() => {
      const state = JSON.parse(view.getByTestId("completion-state").props.children);
      expect(state.settings).toMatchObject({ largerText: true, highContrast: true });
    });
  });

  it("edits the real local profile and advances to photo selection", async () => {
    const onNavigate = jest.fn();
    const view = await render(
      <ConsumerProvider initialState={{ ...initialConsumerState, hydrated: true }}>
        <CompletionFlowScreen slug="edit-profile" onNavigate={onNavigate} />
        <StateProbe />
      </ConsumerProvider>,
    );

    await fireEvent.changeText(view.getByLabelText("Display name"), "Andre");
    await fireEvent.changeText(view.getByLabelText("Handle"), "@andreoutside");
    await fireEvent.press(view.getByText("Save profile"));

    await waitFor(() => {
      const state = JSON.parse(view.getByTestId("completion-state").props.children);
      expect(state.profile).toMatchObject({ displayName: "Andre", handle: "@andreoutside" });
      expect(onNavigate).toHaveBeenCalledWith("change-photo");
    });
  });

  it("records the local trial state and enters the app", async () => {
    const onNavigate = jest.fn();
    const view = await render(
      <ConsumerProvider initialState={{ ...initialConsumerState, hydrated: true }}>
        <CompletionFlowScreen slug="trial-confirmed" onNavigate={onNavigate} />
        <StateProbe />
      </ConsumerProvider>,
    );

    await fireEvent.press(view.getByText("Start exploring"));

    await waitFor(() => {
      const state = JSON.parse(view.getByTestId("completion-state").props.children);
      expect(state.subscriptionStatus).toBe("trial");
      expect(onNavigate).toHaveBeenCalledWith("home");
    });
  });

  it("uses the catalog next target for standard flows", async () => {
    const onNavigate = jest.fn();
    const view = await render(
      <ConsumerProvider initialState={{ ...initialConsumerState, hydrated: true }}>
        <CompletionFlowScreen slug="verification-code" onNavigate={onNavigate} />
      </ConsumerProvider>,
    );

    await fireEvent.changeText(view.getByLabelText("Verification Code"), "381942");
    await fireEvent.press(view.getByText("Validate demo code"));

    expect(onNavigate).toHaveBeenCalledWith("password-reset-success");
  });

  it("requires an exact typed confirmation before deleting local data", async () => {
    const onNavigate = jest.fn();
    const view = await render(
      <ConsumerProvider initialState={{ ...initialConsumerState, hydrated: true, name: "Andre" }}>
        <CompletionFlowScreen slug="delete-confirmation" onNavigate={onNavigate} />
      </ConsumerProvider>,
    );

    await fireEvent.press(view.getByText("Delete permanently"));
    expect(view.getByText("Type DELETE to confirm.")).toBeTruthy();
    expect(onNavigate).not.toHaveBeenCalled();
    await fireEvent.changeText(view.getByLabelText("Delete confirmation"), "DELETE");
    await fireEvent.press(view.getByText("Delete permanently"));
    await waitFor(() => expect(onNavigate).toHaveBeenCalledWith("welcome"));
  });
});
