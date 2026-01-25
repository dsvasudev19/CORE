import { useNavigate } from 'react-router-dom';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';

const ServerError = () => {
    const navigate = useNavigate();

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-coral-50 to-burgundy-50 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                {/* 500 Illustration */}
                <div className="mb-8">
                    <div className="relative">
                        <h1 className="text-[150px] md:text-[200px] font-bold text-coral-100 leading-none">
                            500
                        </h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <AlertTriangle className="w-24 h-24 text-coral-500 animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-steel-900 mb-4">
                        Internal Server Error
                    </h2>
                    <p className="text-lg text-steel-700 mb-2">
                        Something went wrong on our end.
                    </p>
                    <p className="text-steel-600">
                        We're working to fix the issue. Please try again in a few moments.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={handleRefresh}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-steel-300 text-steel-700 rounded-lg hover:bg-steel-50 hover:border-steel-400 transition-all font-medium shadow-sm"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Refresh Page
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-all font-medium shadow-lg shadow-burgundy/30"
                    >
                        <Home className="w-5 h-5" />
                        Go to Dashboard
                    </button>
                </div>

                {/* Error Details */}
                <div className="mt-12 pt-8 border-t border-steel-200">
                    <details className="text-left">
                        <summary className="text-sm text-steel-600 cursor-pointer hover:text-steel-800 mb-2">
                            Technical Details
                        </summary>
                        <div className="bg-navy-900 text-steel-100 p-4 rounded-lg text-xs font-mono overflow-x-auto">
                            <p>Error Code: 500</p>
                            <p>Timestamp: {new Date().toISOString()}</p>
                            <p>Path: {window.location.pathname}</p>
                            <p className="mt-2 text-steel-400">
                                If this problem persists, please contact your system administrator.
                            </p>
                        </div>
                    </details>
                </div>
            </div>
        </div>
    );
};

export default ServerError;
