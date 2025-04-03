"use client"

import { api } from "@/app/lib/api"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import Loading from "@/app/components/Loading"
import { deleteCookie, getCookie } from "cookies-next"

export default function ResetPassword(){
    const router = useRouter()

    const [passwordVisible, setPasswordVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [verifica, setVerifica] = useState(true)
    const [email, setEmail] = useState<string | null>("")

    const resetPassword = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)

        try {
            const response = await fetch(`${api}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: formData.get('password')
                })
            })

            if (!response.ok) {
                throw new Error("Erro ao resetar a senha.")
            }

            deleteCookie("token_reset")
            alert("Senha resetada com sucesso!")
            setVerifica(false)
            router.push('/')

        } catch (error) {
            console.error("Error resetando senha:", error)
            alert("Ocorreu um erro ao resetar a senha!")
        } finally {
            setLoading(false)
        }
    }

    const verificaToken = async () => {
        if (typeof window === "undefined") return;
        try {
            const jwt = getCookie('token_reset')
            
            if (!jwt) {
                throw new Error("Token não encontrado.")
            }

            const response = await fetch(`${api}/verifica-jwt`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    secret_key: process.env.NEXT_PUBLIC_RESET_SECRET_KEY,
                    token: jwt
                })
            })

            if (!response.ok) {
                throw new Error("Token inválido.")
            }

        } catch (error) {
            console.error("Error verificando token:", error)
            alert("Erro ao acessar página")
            router.push('/forgot-password') // Correção: Usar router.push()
        }
    }

    useEffect(() => {
        if (verifica) {
            verificaToken()
        }
    }, [verifica])

    useEffect(() =>{
        const storedEmail = localStorage.getItem("resetEmail")
        setEmail(storedEmail)
    }, [])

    return (
        <div className="h-full flex flex-col justify-start items-center">
            <div className="fixed top-4 left-4">
                <button 
                    onClick={() => router.push('/')} // Correção: Usar router.push() 
                    className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Voltar
                </button>
            </div>

            <h1 className="font-bold pt-12 text-2xl">Resetar Senha</h1>

            <div className="lg:w-1/3 h-full flex flex-col items-center justify-center space-y-4">
                <h1 className="text-start w-full">Nova Senha:</h1>
                <form className="lg:w-full space-y-6 flex flex-col items-center" onSubmit={resetPassword}>
                    <div className="w-full mt-2 flex justify-end">
                        <input
                            className="block w-full rounded-md border-indigo-400 border-2 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"       
                            type={passwordVisible ? "text" : "password"}
                            name="password" 
                            id="password" 
                            placeholder="senha" 
                        />
                        <button
                            type="button"
                            onClick={() => setPasswordVisible(prev => !prev)}
                            className="absolute mt-5 mr-2 transform -translate-y-1/2 text-xl"
                        >
                            {passwordVisible ? '👁️' : '🙈'}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="flex w-3/5 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Confirmar
                    </button>
                </form>
            </div>
            {loading && <Loading />}
        </div>
    )
}
