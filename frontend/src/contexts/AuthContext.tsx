import { createContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../api.ts';
import type { User } from "../types/user.type.ts";

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        checkAuth();
    }, [])

    const checkAuth = async () => {
        try {
            const response = await api.get<{ success: boolean; user: User }>('/auth/me');
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            setUser(null);
            console.error('Error checking auth', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        try {
            const response = await api.post<{ success: boolean; message: string; user: User }>('/auth/login', { username, password });
            setUser(response.data.user);
        } catch (error) {
            setUser(null);
            console.error('Login failed', error);
            throw error;
        }
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('logsQueryParams');

        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;