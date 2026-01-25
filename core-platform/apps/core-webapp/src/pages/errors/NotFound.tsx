import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-steel-50 to-steel-100 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <div className="relative">
                        <h1 className="text-[150px] md:text-[200px] font-bold text-steel-200 leading-none">
                            404
                        </h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Search className="w-24 h-24 text-steel-400 animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-steel-900 mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-lg text-steel-700 mb-2">
                        Oops! The page you're looking for doesn't exist.
                    </p>
                    <p className="text-steel-600">
                        It might have been moved, deleted, or the URL might be incorrect.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-steel-300 text-steel-700 rounded-lg hover:bg-steel-50 hover:border-steel-400 transition-all font-medium shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-all font-medium shadow-lg shadow-burgundy/30"
                    >
                        <Home className="w-5 h-5" />
                        Go to Dashboard
                    </button>
                </div>

                {/* Helpful Links */}
                <div className="mt-12 pt-8 border-t border-steel-200">
                    <p className="text-sm text-steel-600 mb-4">You might be looking for:</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <button
                            onClick={() => navigate('/a/projects')}
                            className="text-sm text-burgundy-600 hover:text-burgundy-700 hover:underline font-medium"
                        >
                            Projects
                        </button>
                        <span className="text-steel-300">•</span>
                        <button
                            onClick={() => navigate('/a/employees')}
                            className="text-sm text-burgundy-600 hover:text-burgundy-700 hover:underline font-medium"
                        >
                            Employees
                        </button>
                        <span className="text-steel-300">•</span>
                        <button
                            onClick={() => navigate('/a/teams')}
                            className="text-sm text-burgundy-600 hover:text-burgundy-700 hover:underline font-medium"
                        >
                            Teams
                        </button>
                        <span className="text-steel-300">•</span>
                        <button
                            onClick={() => navigate('/a/settings')}
                            className="text-sm text-burgundy-600 hover:text-burgundy-700 hover:underline font-medium"
                        >
                            Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
