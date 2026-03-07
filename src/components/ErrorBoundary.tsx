// ErrorBoundary.tsx

import { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Optional custom fallback UI. Receives the caught error. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // In production you'd forward this to an error tracking service
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error) {
      if (fallback) return fallback(error, this.reset);

      return (
        <div
          style={{
            maxWidth: 600,
            margin: '4rem auto',
            padding: '2rem',
            background: '#fff8f8',
            border: '1.5px solid #fca5a5',
            borderRadius: 12,
            textAlign: 'center',
            fontFamily: 'inherit',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem', fontWeight: 700 }}>!</div>
          <h2
            style={{
              color: '#991b1b',
              fontFamily: 'Libre Baskerville, Georgia, serif',
              marginBottom: '0.5rem',
            }}
          >
            Something went wrong
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <button
            onClick={this.reset}
            style={{
              background: '#0e2a56',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '0.65rem 1.5rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return children;
  }
}
