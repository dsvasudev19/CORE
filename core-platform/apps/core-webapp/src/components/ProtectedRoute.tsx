import { ReactNode } from 'react';
import { RestrictedAccess } from './index';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredPermission?: string;
    requiredRole?: string;
    fallback?: ReactNode;
}

/**
 * ProtectedRoute Component
 * Wraps routes that require specific permissions or roles
 * Shows RestrictedAccess component if user doesn't have required access
 * 
 * Usage:
 * <Route path="admin" element={
 *   <ProtectedRoute requiredRole="ADMIN">
 *     <AdminPage />
 *   </ProtectedRoute>
 * } />
 */
const ProtectedRoute = ({
    children,
    requiredPermission,
    requiredRole,
    fallback
}: ProtectedRouteProps) => {
    const { user } = useAuth();

    // Check if user has required role
    if (requiredRole) {
        const hasRole = user?.roles?.some(role =>
            role.name === requiredRole || role.name === 'SUPER_ADMIN'
        );

        if (!hasRole) {
            return fallback || (
                <RestrictedAccess
                    message={`You need ${requiredRole} role to access this page.`}
                    fullPage={true}
                />
            );
        }
    }

    // Check if user has required permission
    if (requiredPermission) {
        const hasPermission = user?.permissions?.some(permission =>
            permission.name === requiredPermission
        );

        if (!hasPermission) {
            return fallback || (
                <RestrictedAccess
                    message={`You don't have the required permission (${requiredPermission}) to access this page.`}
                    fullPage={true}
                />
            );
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
