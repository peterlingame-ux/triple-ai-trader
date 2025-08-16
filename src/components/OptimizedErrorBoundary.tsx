import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { logger } from "@/utils/errorHandler";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class OptimizedErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error with context
    logger.error('Component Error Boundary Caught Error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    }, 'OptimizedErrorBoundary');
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-6 m-4">
          <div className="text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Something went wrong</h2>
            <p className="text-slate-400">
              An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
            </p>
            <Button 
              onClick={this.handleRetry}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mt-4">
                <summary className="text-sm text-slate-500 cursor-pointer">Error Details (Development)</summary>
                <pre className="text-xs text-red-400 mt-2 p-2 bg-slate-900 rounded overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}