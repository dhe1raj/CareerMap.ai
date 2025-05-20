
import { Component, ErrorInfo, ReactNode } from "react";

interface RootErrorBoundaryProps {
  children: ReactNode;
}

interface RootErrorBoundaryState {
  hasError: boolean;
}

export class RootErrorBoundary extends Component<RootErrorBoundaryProps, RootErrorBoundaryState> {
  constructor(props: RootErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): RootErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Root level error caught:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyber-deeper via-brand-900 to-cyber-dark p-6">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-lg max-w-md w-full text-white">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="mb-6">The application encountered an error. Please try refreshing the page or contact support if the problem persists.</p>
            <button 
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 transition-colors rounded-md" 
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
