import { RefreshCw, AlertTriangle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServerErrorComponentProps {
  error?: Error | string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  fullPage?: boolean;
}

const ServerErrorComponent = ({
  error,
  onRetry,
  showHomeButton = true,
  fullPage = false
}: ServerErrorComponentProps) => {
  const navigate = useNavigate();

  const errorMessage = typeof error === 'string'
    ? error
    : error?.message || 'An unexpected error occurred';

  const content = (
    <div className="text-center">
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div className="w-20 h-20 bg-coral-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-coral-600" />
        </div>
      </div>

      {/* Message */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-steel-900 mb-2">
          Something Went Wrong
        </h3>
        <p className="text-steel-700 text-sm mb-3">
          {errorMessage}
        </p>
        <p className="text-xs text-steel-600">
          Please try again or contact support if the problem persists.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-steel-300 text-steel-700 rounded-lg hover:bg-steel-50 hover:border-steel-400 transition-all text-sm font-medium shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
        {showHomeButton && (
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-all text-sm font-medium shadow-lg shadow-burgundy/30"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        )}
      </div>

      {/* Error Details (for development) */}
      {process.env.NODE_ENV === 'development' && error instanceof Error && (
        <details className="mt-6 text-left">
          <summary className="text-xs text-steel-600 cursor-pointer hover:text-steel-800 mb-2">
            Error Details (Dev Only)
          </summary>
          <div className="bg-navy-900 text-steel-100 p-3 rounded text-xs font-mono overflow-x-auto max-h-40 overflow-y-auto">
            <p className="text-coral-400 mb-2">{error.name}: {error.message}</p>
            {error.stack && (
              <pre className="text-steel-400 whitespace-pre-wrap text-[10px]">
                {error.stack}
              </pre>
            )}
          </div>
        </details>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coral-50 to-burgundy-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-xl p-8">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-coral-50 border-2 border-coral-200 rounded-lg p-6">
      {content}
    </div>
  );
};

export default ServerErrorComponent;
