
import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Building2, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await login({ email, password });
            console.log(result)
            if (result.success) {
                console.log('Login successful');

                // Redirect user based on role or dashboard
                if (result.user?.roles?.includes('SUPER_ADMIN')) {
                    navigate('/a/dashboard');
                } else {
                    navigate('/e/dashboard');
                }
            } else {
                setError(result.message || 'Login failed. Please try again.');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError('Unable to connect to server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-steel-50 via-white to-burgundy-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-burgundy-600 rounded-2xl mb-4">
                        <Building2 size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-steel-900 mb-2">Welcome to CORE</h1>
                    <p className="text-steel-600">Sign in to access your workspace</p>
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

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
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
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-steel-300 text-burgundy-600 focus:ring-burgundy-500"
                                />
                                <span className="text-sm text-steel-700">Remember me</span>
                            </label>
                            <Link
                                to="/auth/forgot-password"
                                className="text-sm font-medium text-burgundy-600 hover:text-burgundy-700"
                            >
                                Forgot password?
                            </Link>
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
                            {loading ? 'Signing in...' : 'Sign In'}
                            {!loading && (
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-6">
                    <p className="text-sm text-steel-600">
                        Don't have an account?{' '}
                        <button className="font-medium text-burgundy-600 hover:text-burgundy-700">
                            Contact your administrator
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
