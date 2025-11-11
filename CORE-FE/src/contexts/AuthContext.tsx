

// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import axiosInstance from '../axiosInstance';

interface AuthContextType {
    user: any;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
    refreshAccessToken: () => Promise<string | null>;
    updateUser: (user: any) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
    const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
    const [isLoading, setIsLoading] = useState(true);

    // ✅ Restore session and fetch current user

    const fetchCurrentUser = async () => {
        if (!accessToken) {
            setIsLoading(false);
            return;
        }

        try {
            const res = await axiosInstance.post(
                '/auth/me',
                accessToken,

            );
            console.log(res)

            if (res.status===200) {
                const u = res.data.data;
                console.log(u)
                setUser(u);
                setIsAuthenticated(true);
            } else {
                console.warn('⚠️ Failed to fetch user details:', res.data?.message);
                // handleLogoutLocally();
            }
        } catch (error: any) {
            console.error('❌ Error fetching /me:', error.response?.data || error.message);
            handleLogoutLocally();
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
       

        fetchCurrentUser();
    }, []); // 🔁 Run once on mount

    // ✅ Login
    const login = async (credentials: { email: string; password: string }) => {
        try {
            const res = await axiosInstance.post('/auth/login', credentials);

            if (res.data?.success && res.data.data) {
                const data = res.data.data;
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);

                setAccessToken(data.accessToken);
                setRefreshToken(data.refreshToken);
                setIsAuthenticated(true);
                setUser({
                    id: data.userId,
                    email: data.email,
                    organizationId: data.organizationId,
                    roles: data.roles,
                });

                return { success: true, message: res.data.message || 'Login successful' };
            }

            return { success: false, message: res.data?.message || 'Login failed' };
        } catch (err: any) {
            console.error('❌ Login error:', err);
            const message = err.response?.data?.message || 'Invalid credentials';
            return { success: false, message };
        }
    };

    // ✅ Logout
    const logout = async () => {
        try {
            if (refreshToken) {
                await axiosInstance.post(`/auth/logout?refreshToken=${refreshToken}`);
            }
        } catch (err) {
            console.warn('Logout error:', err);
        } finally {
            handleLogoutLocally();
        }
    };

    const handleLogoutLocally = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    // ✅ Refresh access token
    const refreshAccessToken = async (): Promise<string | null> => {
        if (!refreshToken) return null;
        try {
            const res = await axiosInstance.post(`/auth/refresh?refreshToken=${refreshToken}`);
            if (res.data?.success && res.data.data) {
                const data = res.data.data;
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                setAccessToken(data.accessToken);
                setRefreshToken(data.refreshToken);
                return data.accessToken;
            }
        } catch (error) {
            console.error('🔁 Token refresh failed:', error);
            handleLogoutLocally();
        }
        return null;
    };

    // ✅ Update user info manually
    const updateUser = (updatedUser: any) => setUser(updatedUser);

    const value: AuthContextType = {
        user,
        accessToken,
        refreshToken,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshAccessToken,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
