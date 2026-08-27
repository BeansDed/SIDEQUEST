import { StateView } from "@/components/state-view";
import { Screen } from "@/components/screen";

export function NotFoundScreen({ onReturnHome }: { onReturnHome(): void }) {
  return (
    <Screen>
      <StateView
        kind="error"
        title="That sidequest wandered off."
        message="The link may be old, but your saved cafés and progress are still here."
        action="Return home"
        onAction={onReturnHome}
      />
    </Screen>
  );
}
