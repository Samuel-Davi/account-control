'use client'

import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";


type User = {
    token: string;
    name: string;
    email: string;
    avatarUrl: string;
}

type SignInData = {
    email: string;
    password: string;
}

type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;
    signIn: (data: SignInData) => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: any){
    const isAuthenticated = false;

    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState("");
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            const token = getCookie("accountcontrol-token")
    
            if (token) {
                const res = await fetch('/services/cookies')
                const user = await res.json()
                console.log("teste")
                console.log(user)
            }
        }

        fetchData()
      }, [])

    async function signIn({email, password} : SignInData){
        const res = await fetch("/services/auth", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" },
          });
        if (!res.ok){
            setError("Falha ao fazer login")
            return
        }
        const resUser:User = await res.json()
        setUser(resUser)

        api.defaults.headers['Authorization'] = `Bearer ${resUser.token}`

        router.push('/dashboard')
    }

    return (
        <AuthContext.Provider value={{ user , isAuthenticated, signIn }}>
            {children}
        </AuthContext.Provider>
    )
}