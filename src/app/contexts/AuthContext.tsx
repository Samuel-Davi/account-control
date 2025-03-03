'use client'

import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";


type User = {
    token: string | null;
    name: string;
    email: string;
    avatarUrl: string;
}

export type SignInData = {
    email: string;
    password: string;
    timeToken: string;
}

type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;
    error: boolean;
    signIn: (data: SignInData) => Promise<void>;
}

const delay = (amount = 750) => new Promise(resolve => setTimeout(resolve, amount))

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: any){
    const isAuthenticated = false;

    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState(false);
    const router = useRouter()

    const carregaDados = (data:any) => {
        //console.log("data: ", data)
        const loadUser:User = {
            token: null,
            name: data.name,
            email: data.email,
            avatarUrl: data.avatarUrl,
        }
        setUser(loadUser)
        
    }

    useEffect(() => {
        //console.log("user setado: ", user)
    }, [user])

    useEffect(() => {
        const fetchData = async () => {
            const token = await getCookie("account-token")
    
            if (token) {
                fetch("/services/user", {
                    method: "GET",
                    headers: {
                      "Authorization": `Bearer ${token}`,
                      "Content-Type": "application/json"
                    }
                  })
                  .then(response => response.json())
                  .then(data => carregaDados(data.user))
                  .catch(error => console.error("Erro:", error));
            }
        }

        fetchData()
      }, [])

    async function signIn({email, password, timeToken} : SignInData){
        const res = await fetch("/services/auth", {
            method: "POST",
            body: JSON.stringify({ email, password, timeToken }),
            headers: { "Content-Type": "application/json" },
          });
        if (!res.ok){
            setError(true)
            await delay()
            setError(false)
            return
        }
        const resUser:User = await res.json()
        setUser(resUser)

        setCookie("account-token", resUser.token, { httpOnly: false, maxAge: 3600 });

        //api.defaults.headers['Authorization'] = `Bearer ${resUser.token}`

        router.push('/dashboard')
    }

    return (
        <AuthContext.Provider value={{ error, user , isAuthenticated, signIn }}>
            {children}
        </AuthContext.Provider>
    )
}