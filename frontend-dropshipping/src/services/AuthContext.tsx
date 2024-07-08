"use client";

import { useRouter } from "next/navigation";
import { parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "./api";

export const AuthContext = createContext({} as AuthContextType);

type AuthProviderProps = {
    children: ReactNode;
};

type SignInData = {
    email: string;
    password: string;
};

type User = {
    id: string;
    name: string;
    email: string;
    password: string;
};

type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;
    signIn: (data: SignInData) => Promise<void>;
    logout: () => void;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
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
            .then(response => setUser(response.data))
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
        router.push("/");
    }

    function logout() {
        setUser(null);
        setCookie(undefined, 'auth_token', '', { maxAge: -1 });
        router.push("/login");
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, signIn, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
