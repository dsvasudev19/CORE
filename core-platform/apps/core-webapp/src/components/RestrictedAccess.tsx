import { useNavigate } from 'react-router-dom';
import { ShieldOff, Home, ArrowLeft, Lock } from 'lucide-react';

interface RestrictedAccessProps {
    message?: string;
    showBackButton?: boolean;
    fullPage?: boolean;
}

const RestrictedAccess = ({
    message = "You don't have permission to access this resource.",
    showBackButton = true,
    fullPage = true
}: RestrictedAccessProps) => {
    const navigate = useNavigate();

    const content = (
        <div className="text-center">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
                <div className="relative">
                    <div className="w-24 h-24 bg-coral-100 rounded-full flex items-center justify-center">
                        <ShieldOff className="w-12 h-12 text-coral-600" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-burgundy-600 rounded-full flex items-center justify-center">
                        <Lock className="w-4 h-4 text-white" />
                    </div>
                </div>
            </div>

            {/* Message */}
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-steel-900 mb-3">
                    Access Restricted
                </h2>
                <p className="text-steel-700 mb-2">
                    {message}
                </p>
                <p className="text-sm text-steel-600">
                    If you believe this is an error, please contact your administrator.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                {showBackButton && (
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-steel-300 text-steel-700 rounded-lg hover:bg-steel-50 hover:border-steel-400 transition-all font-medium shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                )}
                <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-all font-medium shadow-lg shadow-burgundy/30"
                >
                    <Home className="w-4 h-4" />
                    Go to Dashboard
                </button>
            </div>
        </div>
    );

    if (fullPage) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-coral-50 to-burgundy-50 flex items-center justify-center px-4">
                <div className="max-w-xl w-full">
                    {content}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border-2 border-coral-200 p-8 max-w-xl mx-auto">
            {content}
        </div>
    );
};

export default RestrictedAccess;
