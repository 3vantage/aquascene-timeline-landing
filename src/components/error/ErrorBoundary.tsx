'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';

interface ErrorDetails {
  error: Error;
  errorInfo: ErrorInfo;
  timestamp: number;
  userAgent: string;
  url: string;
  userId?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: ErrorDetails) => void;
  showErrorDetails?: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorDetails: ErrorDetails = {
      error,
      errorInfo,
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    };

    // Log to console
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error details:', errorDetails);

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(errorDetails);
    }

    // Report to error tracking service
    this.reportError(errorDetails);
  }

  private reportError = (errorDetails: ErrorDetails) => {
    // In a real application, you would send this to your error tracking service
    // like Sentry, LogRocket, Bugsnag, etc.
    
    if (typeof fetch !== 'undefined') {
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...errorDetails,
          error: {
            name: errorDetails.error.name,
            message: errorDetails.error.message,
            stack: errorDetails.error.stack
          }
        })
      }).catch(() => {
        // Silently fail - we don't want error reporting to break the app further
      });
    }

    // Also try sending with sendBeacon if available
    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      try {
        navigator.sendBeacon('/api/errors', JSON.stringify(errorDetails));
      } catch (e) {
        // Ignore beacon errors
      }
    }
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined });
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 text-red-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Oops! Something went wrong
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                We apologize for the inconvenience. Our team has been notified.
              </p>
              {this.state.errorId && (
                <p className="mt-2 text-xs text-gray-500">
                  Error ID: {this.state.errorId}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <button
                onClick={this.handleRetry}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Try Again
              </button>
              
              <button
                onClick={this.handleReload}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Reload Page
              </button>
            </div>

            {this.props.showErrorDetails && this.state.error && (
              <details className="mt-4">
                <summary className="text-sm text-gray-600 cursor-pointer">
                  Show Error Details
                </summary>
                <div className="mt-2 p-4 bg-gray-100 rounded-md">
                  <p className="text-xs font-mono text-red-600">
                    {this.state.error.name}: {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="text-center">
              <p className="text-xs text-gray-500">
                If the problem persists, please{' '}
                <a 
                  href="mailto:support@aquascene.com" 
                  className="text-blue-600 hover:text-blue-500"
                >
                  contact support
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Hook for programmatic error reporting
export function useErrorReporting() {
  const reportError = (error: Error, context?: Record<string, any>) => {
    const errorDetails = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context,
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    };

    console.error('Manual error report:', error, context);

    // Report to API
    if (typeof fetch !== 'undefined') {
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorDetails)
      }).catch(() => {
        // Silently fail
      });
    }
  };

  return { reportError };
}

// Error boundary wrapper for easier usage
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryConfig?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WithErrorBoundaryComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryConfig}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorBoundaryComponent;
}