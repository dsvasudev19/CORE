import React, { Component, ErrorInfo, ReactNode } from 'react';
import ServerError from '../pages/errors/ServerError';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // You can log to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use ServerError page
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <ServerError />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
