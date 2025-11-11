import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Check if the current route is an auth route (e.g., /auth/login or /auth/register)
    const isAuthRoute = location.pathname.startsWith('/auth');
    console.log(location.pathname)
    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-light-background dark:bg-dark-background">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            </div>
        );
    }

    // Auth routes don't require authentication
    if (isAuthRoute) {
        console.log("yes its a auth route")
        // If user is authenticated and trying to access auth routes, redirect to dashboard
        if (isAuthenticated) {
            return <Navigate to="/a/dashboard" replace />;
        }
        return <>{children}</>;
    }

    // For non-auth routes, require authentication
    if (!isAuthenticated) {
        // Redirect to login, preserving the intended destination
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default AuthGuard;