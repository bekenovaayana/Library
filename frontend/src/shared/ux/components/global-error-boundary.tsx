"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { FallbackUI } from "@/shared/ux/components/fallback-ui";
import { ru } from "@/shared/i18n";

interface GlobalErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

interface GlobalErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): GlobalErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error("[GlobalErrorBoundary]", error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center p-6">
          <FallbackUI
            kind="render"
            title={ru.errors.unexpectedSection}
            message={this.state.error?.message ?? ru.errors.unexpectedSection}
            onRetry={this.handleReset}
            retryLabel={ru.errors.reloadSection}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
