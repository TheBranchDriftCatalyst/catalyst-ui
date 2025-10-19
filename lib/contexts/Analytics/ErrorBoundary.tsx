/**
 * Analytics Error Boundary
 * Catches React errors and tracks them via analytics
 */

import { Component, ErrorInfo, ReactNode } from "react";
import type { AnalyticsContextValue, ErrorEvent } from "./types";
import { storage } from "./storage";

interface Props {
  children: ReactNode;
  /** Fallback UI to render on error */
  fallback?: (error: Error, errorInfo: ErrorInfo, reset: () => void) => ReactNode;
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Analytics context (optional, will use storage directly if not provided) */
  analytics?: AnalyticsContextValue | null;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class AnalyticsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Track error via analytics
    const errorEvent: ErrorEvent = {
      message: error.message,
      stack: error.stack || undefined,
      componentStack: errorInfo.componentStack || undefined,
      type: "react",
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now(),
    };

    // Store error
    storage.addError(errorEvent);

    // Call analytics if available
    if (this.props.analytics?.trackError) {
      this.props.analytics.trackError(error, {
        componentStack: errorInfo.componentStack,
      });
    }

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({ errorInfo });

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error("Error caught by boundary:", error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.state.errorInfo!, this.resetError);
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-8">
          <div className="max-w-2xl w-full space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-destructive">Something went wrong</h1>
              <p className="text-muted-foreground">
                An error occurred in the application. The error has been logged and our team will
                investigate.
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg overflow-auto max-h-96">
              <p className="font-mono text-sm font-semibold mb-2">{this.state.error.message}</p>
              {this.state.error.stack && (
                <pre className="text-xs opacity-70 whitespace-pre-wrap">
                  {this.state.error.stack}
                </pre>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={this.resetError}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:opacity-90 transition-opacity"
              >
                Reload Page
              </button>
            </div>

            {import.meta.env.DEV && this.state.errorInfo?.componentStack && (
              <details className="bg-muted p-4 rounded-lg">
                <summary className="cursor-pointer font-semibold mb-2">Component Stack</summary>
                <pre className="text-xs opacity-70 whitespace-pre-wrap mt-2">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
