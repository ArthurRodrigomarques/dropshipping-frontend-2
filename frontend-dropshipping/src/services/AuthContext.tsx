"use client";

import { useRouter } from 'next/navigation';
import { parseCookies, setCookie } from 'nookies';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api } from '@/services/api';

export const AuthContext = createContext({} as AuthContextType);

type AuthProviderProps = {
    children: ReactNode;
};

type SignInData = {
    email: string;
    password: string;
};

type Access = {
    name: string;
};

type UserAccess = {
    Access: Access;
};

type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    userAccess: UserAccess[];
};

type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    signIn: (data: SignInData) => Promise<void>;
    logout: () => void;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    const isAuthenticated = !!user;

    useEffect(() => {
        const { auth_token: token } = parseCookies();

        if (token) {
            api.get('/get-unique-user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
            .then(response => {
                setUser(response.data);
                setToken(token);
            })
            .catch(err => console.log(err));
        }
    }, []);

    async function signIn({ email, password }: SignInData) {
        const response = await api.post('/sign-in', { email, password });
        const { token, user } = response.data;

        setCookie(undefined, 'auth_token', token, {
            maxAge: 30 * 24 * 60 * 60 // 30 dias
        });

        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        setUser(user);
        setToken(token);

        window.location.href = "/";
    }

    function logout() {
        setUser(null);
        setToken(null);
        setCookie(undefined, 'auth_token', '', { maxAge: -1 });
        router.push("/login");
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, token, signIn, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};