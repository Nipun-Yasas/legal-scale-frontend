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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window !== 'undefined') {
            try {
                const item = localStorage.getItem('auth_user');
                return item ? JSON.parse(item) : null;
            } catch (error) {
                return null;
            }
        }
        return null;
    });

    const [loading, setLoading] = useState(() => {
        if (typeof window !== 'undefined') {
            return !localStorage.getItem('auth_user');
        }
        return true;
    });
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
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
        if (!loading && !user && (pathname.startsWith('/student-dashboard') || pathname.startsWith('/owner-dashboard'))) {
            router.push('/auth');
        }
    }, [user, loading, pathname, router]);


    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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
