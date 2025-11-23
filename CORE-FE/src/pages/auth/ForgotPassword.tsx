import { useState } from 'react';
import { Mail, Building2, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post('/auth/forgot-password/initiate', null, {
                params: { email }
            });

            if (response.data?.success) {
                setSuccess(true);
            } else {
                setError(response.data?.message || 'Failed to send reset email. Please try again.');
            }
        } catch (err: any) {
            console.error('Forgot password error:', err);
            setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-steel-50 via-white to-burgundy-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                            <CheckCircle size={32} className="text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-steel-900 mb-2">Check Your Email</h1>
                        <p className="text-steel-600">We've sent password reset instructions to</p>
                        <p className="text-burgundy-600 font-medium mt-1">{email}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-steel-200 p-8">
                        <div className="space-y-4 text-center">
                            <p className="text-sm text-steel-600">
                                Click the link in the email to reset your password. If you don't see the email, check your spam folder.
                            </p>
                            <Link
                                to="/auth/login"
                                className="inline-flex items-center gap-2 text-sm font-medium text-burgundy-600 hover:text-burgundy-700"
                            >
                                <ArrowLeft size={16} />
                                Back to Sign In
                            </Link>
                        </div>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-sm text-steel-600">
                            Didn't receive the email?{' '}
                            <button
                                onClick={() => setSuccess(false)}
                                className="font-medium text-burgundy-600 hover:text-burgundy-700"
                            >
                                Try again
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-steel-50 via-white to-burgundy-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-burgundy-600 rounded-2xl mb-4">
                        <Building2 size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-steel-900 mb-2">Forgot Password?</h1>
                    <p className="text-steel-600">No worries, we'll send you reset instructions</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-steel-200 p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    className="w-full pl-11 pr-4 py-3 border border-steel-300 rounded-lg text-sm focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-100 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                                {error}
                            </p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full ${loading ? 'bg-burgundy-400' : 'bg-burgundy-600 hover:bg-burgundy-700'
                                } text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 group`}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                            {!loading && (
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-6">
                    <Link
                        to="/auth/login"
                        className="inline-flex items-center gap-2 text-sm font-medium text-burgundy-600 hover:text-burgundy-700"
                    >
                        <ArrowLeft size={16} />
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
