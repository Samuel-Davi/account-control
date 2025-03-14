'use client'

import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useEffect, useState } from "react";
import { User } from "@/app/models/User";
import { api } from "../lib/api";

type SignUpData = {
    name: string;
    email: string;
    password: string;
}

export type SignInData = {
    email: string;
    password: string;
    timeToken: string;
}

interface AuthProviderProps {
    children: ReactNode;
  }

type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;
    error: boolean;
    signIn: (data: SignInData) => Promise<void>;
    signUp: (data: SignUpData) => Promise<void>;
    saldo: number;
    setSaldo: (newSaldo: number) => void;
    getSaldo: () => Promise<number>;
}

const delay = (amount = 750) => new Promise(resolve => setTimeout(resolve, amount))

export const AuthContext = createContext({} as AuthContextType);
export function AuthProvider({ children }: AuthProviderProps){
    const isAuthenticated = false;

    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState(false);
    const [saldo, setSaldo] = useState(0.0)
    const router = useRouter()

    const carregaDados = (data:User) => {
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
        const token = await getCookie("account_token")

        if (token) {
            await fetch(`${api}/getUser`, {
                method: "GET",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json"
                },
                credentials: "include"
              })
              .then(response => response.json())
              .then(data => carregaDados(data.user))
              .catch(error => console.error("Erro:", error));
        }
        if(user){
            const res = await getSaldo()
            setSaldo(res)
        }
    }

    const getSaldo = async () => {
        const token = await getCookie("account_token")
        let resSaldo = 0

        try{
            await fetch(`${api}/calculaSaldo`, {
                method: "GET",
                    headers: {
                      "Authorization": `Bearer ${token}`,
                      "Content-Type": "application/json"
                    },
                    credentials: "include"
            })
            .then(response => response.json())
            .then(data => {resSaldo = data.saldo})
            return resSaldo
        }catch(error){
            console.error("erro ao carregar o saldo:", error)
            return 0.0
        }
    }
    
    useEffect(() => {
        fetchData()
    }, [])

    async function signIn({email, password, timeToken} : SignInData){
        const res = await fetch(`${api}/auth`, {
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
        const resUser = await res.json()
        setUser(resUser.user)

        const maxAge = resUser.user.timeToken === "1h" ? 3600 : 60*60*24*30;
        setCookie("account_token", resUser.user.token, { httpOnly: false, maxAge: maxAge });

        //api.defaults.headers['Authorization'] = `Bearer ${resUser.token}`

        router.push('/transactions')
    }

    async function signUp({name, email, password }: SignUpData){
        const res = await fetch(`${api}/signup`, {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
            headers: { "Content-Type": "application/json" },
          });
        if (!res.ok){
            setError(true)
            await delay()
            setError(false)
            return
        }
        const resUser = await res.json()
        setUser(resUser.user)

        //api.defaults.headers['Authorization'] = `Bearer ${resUser.token}`

        alert("Usuário criado com sucesso!");

        router.push('/')
    }

    return (
        <AuthContext.Provider value={{ signUp, getSaldo, setSaldo, error, user , isAuthenticated, signIn, saldo }}>
            {children}
        </AuthContext.Provider>
    )
}