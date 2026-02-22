'use server'

import { cookies } from 'next/headers'

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL

export async function loginAction(values: any) {
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        })
        const data = await res.json()
        if (res.ok && data.token) {
            const cookieStore = await cookies();
            cookieStore.set('token', data.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            });
            return { success: true, data }
        }
        return { success: false, error: data.error || 'Login failed' }
    } catch (error: any) {
        return { success: false, error: error.message || 'Login failed' }
    }
}

export async function registerAction(values: any) {
    try {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        })
        const data = await res.json()
        if (res.ok && data.token) {
            const cookieStore = await cookies();
            cookieStore.set('token', data.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            });
            return { success: true, data }
        }
        return { success: false, error: data.error || 'Registration failed' }
    } catch (error: any) {
        return { success: false, error: error.message || 'Registration failed' }
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    return { success: true }
}
