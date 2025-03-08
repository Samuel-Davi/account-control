'use client'

import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { User } from "@/app/models/User";


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
    saldo: number;
    setSaldo: (newSaldo: number) => void;
}

const delay = (amount = 750) => new Promise(resolve => setTimeout(resolve, amount))

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: any){
    const isAuthenticated = false;

    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState(false);
    const [saldo, setSaldo] = useState(0.0)
    const router = useRouter()

    const carregaDados:any = (data:User) => {
        //console.log("data: ", data)
        const loadUser:User = {
            id: data.id,
            token: undefined,
            name: data.name,
            email: data.email,
            avatarURL: data.avatarURL,
        }
        setUser(loadUser)
    }

    useEffect(() => {
        //console.log("user setado: ", user)
    }, [user])

    const fetchData = async () => {
        const token = await getCookie("account-token")

        if (token) {
            await fetch("/api/getUser", {
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
        await fetch('/api/calculaSaldo')
        .then(response => response.json())
        .then(data => setSaldo(data.saldo))
        .catch(error => console.error('Error:', error))
    }
    
    useEffect(() => {
        fetchData()
    }, [])

    async function signIn({email, password, timeToken} : SignInData){
        const res = await fetch("/api/auth", {
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

        const maxAge = resUser.timeToken === "1h" ? 3600 : 60*60*24*30;
        setCookie("account-token", resUser.token, { httpOnly: false, maxAge: maxAge });

        //api.defaults.headers['Authorization'] = `Bearer ${resUser.token}`

        router.push('/dashboard')
    }

    return (
        <AuthContext.Provider value={{ setSaldo, error, user , isAuthenticated, signIn, saldo }}>
            {children}
        </AuthContext.Provider>
    )
}