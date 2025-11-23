import { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Building2, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string>('');

    // Verify token on mount
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setError('Invalid or missing reset token');
                setVerifying(false);
                return;
            }

            try {
                const response = await axiosInstance.post('/auth/forgot-password/verify', null, {
                    params: { token }
                });

                if (response.data?.success && response.data?.data?.email) {
                    setUserEmail(response.data.data.email);
                } else {
                    setError('Invalid or expired reset token');
                }
            } catch (err: any) {
                console.error('Token verification error:', err);
                setError(err.response?.data?.message || 'Invalid or expired reset token');
            } finally {
                setVerifying(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validation
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (!token) {
            setError('Invalid or missing reset token');
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post('/auth/forgot-password/reset', null, {
                params: {
                    token,
                    newPassword: password
                }
            });

            if (response.data?.success) {
                setSuccess(true);

                // Redirect to login after 2 seconds
                setTimeout(() => {
                    navigate('/auth/login');
                }, 2000);
            } else {
                setError(response.data?.message || 'Failed to reset password. Please try again.');
            }
        } catch (err: any) {
            console.error('Reset password error:', err);
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-steel-50 via-white to-burgundy-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-burgundy-600 mx-auto mb-4" />
                    <p className="text-steel-600">Verifying reset token...</p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-steel-50 via-white to-burgundy-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                            <CheckCircle size={32} className="text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-steel-900 mb-2">Password Reset!</h1>
                        <p className="text-steel-600">Your password has been successfully reset</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-steel-200 p-8">
                        <div className="space-y-4 text-center">
                            <p className="text-sm text-steel-600">
                                You can now sign in with your new password.
                            </p>
                            <p className="text-xs text-steel-500">
                                Redirecting to login page...
                            </p>
                        </div>
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
                    <h1 className="text-3xl font-bold text-steel-900 mb-2">Reset Password</h1>
                    <p className="text-steel-600">Enter your new password below</p>
                    {userEmail && <p className="text-sm text-steel-500 mt-1">for {userEmail}</p>}
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-steel-200 p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full pl-11 pr-11 py-3 border border-steel-300 rounded-lg text-sm focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-100 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-steel-400 hover:text-steel-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="text-xs text-steel-500 mt-1">Must be at least 8 characters</p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full pl-11 pr-11 py-3 border border-steel-300 rounded-lg text-sm focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-100 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-steel-400 hover:text-steel-600"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
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
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                            {!loading && (
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-6">
                    <p className="text-sm text-steel-600">
                        Remember your password?{' '}
                        <Link
                            to="/auth/login"
                            className="font-medium text-burgundy-600 hover:text-burgundy-700"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
