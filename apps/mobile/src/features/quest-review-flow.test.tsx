import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Share, Text } from "react-native";

import { cafes, initialConsumerState, quests } from "@/domain/catalog";
import { CafeProvider } from "@/data/cafe-provider";
import { ConsumerProvider, useConsumer } from "@/state/consumer-provider";

import { CafeDetailScreen } from "./cafe-detail-screen";
import { QuestExperienceScreen } from "./quest-experience-screen";
import { ReviewScreen } from "./review-screen";
import { SavedScreen } from "./saved-screen";

function StateProbe() {
  const { state } = useConsumer();
  return <Text testID="state-probe">{`${state.xp}:${state.reviews.length}`}</Text>;
}

function LiveCafeFixture({ children }: { children: React.ReactNode }) {
  return <CafeProvider apiBaseUrl="https://test.invalid" locationClient={{ requestPermission: async () => ({ granted: true, canAskAgain: true }), getPosition: async () => ({ latitude: 14.56, longitude: 121.02 }) }} loadCafes={async () => cafes}>{children}</CafeProvider>;
}

describe("native café and quest loop", () => {
  it("saves a café into collections", async () => {
    const view = await render(<ConsumerProvider initialState={{ ...initialConsumerState, hydrated: true, collections: [{ ...initialConsumerState.collections[0], cafeIds: [] }] }}><LiveCafeFixture><CafeDetailScreen cafe={cafes[1]} onBack={() => undefined} onReview={() => undefined} /><SavedScreen onOpenCafe={() => undefined} /></LiveCafeFixture></ConsumerProvider>);
    await waitFor(() => expect(view.getAllByText("Morrow Coffee").length).toBeGreaterThan(0));
    await fireEvent.press(view.getByLabelText("Save café"));
    expect(view.getAllByText("Morrow Coffee").length).toBeGreaterThan(1);
  }, 30000);

  it("completes every objective and awards XP", async () => {
    const view = await render(<ConsumerProvider initialState={{ ...initialConsumerState, hydrated: true }}><QuestExperienceScreen quest={quests[0]} onBack={() => undefined} /><StateProbe /></ConsumerProvider>);
    await fireEvent.press(view.getByText("Start quest"));
    await fireEvent.press(view.getByText("Complete step"));
    await fireEvent.press(view.getByText("Complete step"));
    await fireEvent.press(view.getByText("Finish +120 XP"));
    expect(view.getByTestId("state-probe").props.children).toBe("1960:0");
  }, 30000);

  it("explains invalid reviews and stores a valid vibe check", async () => {
    const view = await render(<ConsumerProvider initialState={{ ...initialConsumerState, hydrated: true }}><ReviewScreen cafe={cafes[0]} onDone={() => undefined} /><StateProbe /></ConsumerProvider>);
    await fireEvent.press(view.getByText("Post vibe check"));
    expect(view.getByText("Add a rating, one vibe, and at least 8 characters.")).toBeTruthy();
    await fireEvent.press(view.getByText("5 stars"));
    await fireEvent.press(view.getByText("quiet"));
    await fireEvent.changeText(view.getByPlaceholderText("What should someone know before going?"), "Reliable outlets and calm music.");
    await fireEvent.press(view.getByText("Post vibe check"));
    expect(view.getByTestId("state-probe").props.children).toBe("1840:1");
  }, 30000);

  it("saves a valid visit plan and renders it from local state", async () => {
    const view = await render(<ConsumerProvider initialState={{ ...initialConsumerState, hydrated: true }}><CafeDetailScreen cafe={cafes[0]} onBack={() => undefined} onReview={() => undefined} /></ConsumerProvider>);

    await fireEvent.press(view.getByLabelText("Tomorrow"));
    await fireEvent.changeText(view.getByLabelText("Visit time"), "15:30");
    await fireEvent.changeText(view.getByLabelText("Visit note"), "Window seat");
    await fireEvent.press(view.getByText("Save visit plan"));

    expect(view.getByText("Tomorrow at 15:30")).toBeTruthy();
    expect(view.getByText("Window seat")).toBeTruthy();
  });

  it("shares café details through the native share sheet", async () => {
    const share = jest.spyOn(Share, "share").mockResolvedValue({ action: Share.sharedAction });
    const view = await render(<ConsumerProvider initialState={{ ...initialConsumerState, hydrated: true }}><CafeDetailScreen cafe={cafes[0]} onBack={() => undefined} onReview={() => undefined} /></ConsumerProvider>);

    await fireEvent.press(view.getByLabelText("Share café"));

    expect(share).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining("Soft Hours") }));
    share.mockRestore();
  });
});
