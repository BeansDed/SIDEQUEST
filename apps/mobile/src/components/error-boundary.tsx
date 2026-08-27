import { Component, type ErrorInfo, type PropsWithChildren } from "react";

import { Screen } from "./screen";
import { StateView } from "./state-view";

type ErrorBoundaryProps = PropsWithChildren<{ onReturnHome(): void }>;
type ErrorBoundaryState = { failed: boolean };

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (__DEV__) console.warn("SIDEQUEST screen error", error.message, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <Screen>
        <StateView
          kind="error"
          title="This screen lost the trail."
          message="Your saved cafés and progress are safe. Try the screen again or return home."
          action="Retry"
          onAction={() => this.setState({ failed: false })}
          secondaryAction="Return home"
          onSecondaryAction={this.props.onReturnHome}
        />
      </Screen>
    );
  }
}
