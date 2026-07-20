import React from "react";
import ErrorPage from "@/pages/ErrorPage";

interface Props { children: React.ReactNode }
interface State { hasError: boolean; message?: string }

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage message={this.state.message} onRetry={() => window.location.reload()} />;
    }
    return this.props.children;
  }
}
