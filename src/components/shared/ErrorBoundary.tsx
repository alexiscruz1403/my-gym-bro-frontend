'use client';

import { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center gap-3 py-12 px-4 text-center">
          <p className="font-display text-lg font-semibold">Algo salió mal</p>
          <p className="text-sm text-muted-foreground">
            {this.state.error?.message ?? 'Error inesperado.'}
          </p>
          <Button variant="outline" size="sm" onClick={this.handleReset}>
            Reintentar
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
