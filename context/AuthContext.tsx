'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axiosInstance, { API_PATHS } from '@/lib/axios';
import { useRouter, usePathname } from 'next/navigation';

interface User {
    id: string;
    name?: string | null;
    email: string;
    role: string;
    image?: string | null;
    memberOfLegalDepartment?: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    setAuthUser: (user: User) => void;
    checkUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        try {
            const item = localStorage.getItem('auth_user');
            if (item) {
                setUser(JSON.parse(item));
            }
        } catch (error) {
            // Handle parsing error if needed
        }
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const { data } = await axiosInstance.get(API_PATHS.AUTH.ME);
            const userObj = {
                id: data.id || 'stub-id',
                email: data.email,
                name: data.fullName || data.name,
                role: data.roleName || data.role,
                memberOfLegalDepartment: data.memberOfLegalDepartment
            };
            setUser(userObj);
            localStorage.setItem('auth_user', JSON.stringify(userObj));
        } catch (error: any) {
            console.log('Failed to fetch user', error?.response?.data?.message || error.message);
            setUser(null);
            localStorage.removeItem('auth_user');
        } finally {
            setLoading(false);
        }
    };

    const setAuthUser = (newUser: User) => {
        setUser(newUser);
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_user', JSON.stringify(newUser));
        }
    };

    const login = async (formData: any) => {
        // Now handled by server actions in AuthPage, but kept to satisfy TypeScript context typing
    };

    const register = async (formData: any) => {
        // Now handled by server actions in AuthPage
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' }); // The proxy will route this to spring boot to blacklist the token maybe, but more importantly, delete our own cookie 
            await import('@/app/actions/authActions').then(m => m.logoutAction());
        } catch (e) {
            console.log('Logout failed', e);
        }
        setUser(null);
        localStorage.removeItem('auth_user');
        router.push('/');
    };

    useEffect(() => {
        if (loading) return;

        const rolePathMap: Record<string, string> = {
            SYSTEM_ADMIN: '/admin',
            LEGAL_SUPERVISOR: '/supervisor',
            LEGAL_OFFICER: '/officer',
            MANAGEMENT: '/manager',
            USER: '/user',
        };

        if (!user) {
            // Redirect unauthenticated users trying to access protected routes
            if (pathname !== '/' && !pathname.startsWith('/auth')) {
                router.push('/auth');
            }
        } else {
            // Redirect authenticated users to their correct dashboard if accessing unauthorized routes
            const allowedBasePath = rolePathMap[user.role];
            if (allowedBasePath && !pathname.startsWith(allowedBasePath)) {
                router.push(allowedBasePath);
            }
        }
    }, [user, loading, pathname, router]);

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, setAuthUser, checkUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
