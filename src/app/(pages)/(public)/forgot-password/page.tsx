'use client'

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import validator from 'validator'
import { api } from "@/app/lib/api";
import { setCookie } from "cookies-next";

export default function ForgotPassword(){

  const { register, handleSubmit } = useForm();
  const [email, setEmail] = useState("")
  const [enviado, setEnviado] = useState(false)
  const [code, setCode] = useState("")
  const [realCode, setRealCode] = useState("")
  const [clicado, setClicado] = useState(false)

  const router = useRouter()

  function isValidEmail(email: string): boolean {
    return validator.isEmail(email)
  }

  const sendCode = () => {
    setClicado(true)
    if(isValidEmail(email)){
        setRealCode(Math.random().toString(36).substring(2, 8))
    }else{
        alert("E-mail inválido!")
    }
  }

  const sendEmail  = async (email: string, realCode: string) => {
    try{
        const response = await fetch(`${api}/send-email`, {
            method: "POST",
            body: JSON.stringify({ email, realCode }),
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error('Erro ao enviar e-mail');
        }
        setEnviado(true)
      } catch (error) {
        console.error("Error ao enviar email:", error)
        alert("Erro ao enviar email!")
      }
  }

  useEffect(() => {
    if (clicado) sendEmail(email, realCode)
  }, [realCode, setRealCode])

  const confirmCode = () => {
    if(code === realCode)  {
        setCookie("token_reset", "resetar");
        router.push(`/reset-password?email=${email}`);
    }
    else alert("Código inválido!")
  }

    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8">
              <div className="fixed top-4 left-4">
                <button onClick={() => router.push('/') } className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" 
                  >Voltar
                  </button>
              </div>
              {!enviado && (
                <div className="flex flex-col items-center justify-center">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img
                        alt="Your Company"
                        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                        className="mx-auto h-10 w-auto"
                        />
                        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Reset Password
                        </h2>
                    </div>

                    <div className="pt-4 md:w-2/5">
                        <p className="text-center">Digite o endereço de e-mail que você usa no Roxyall Control para enviarmos um link de redefinição de senha.</p>
                    </div>
            
                    <div className="mt-10 w-5/6 md:w-4/5 lg:w-4/6 flex justify-center">
                        <form onSubmit={handleSubmit(sendCode)} className="flex items-center flex-col space-y-8 w-full md:w-4/5">
                        <div className="flex w-3/5 flex-col items-start justify-between">
                            <label htmlFor="email" className="block text-start text-sm/6 font-medium text-gray-900">
                            Email:
                            </label>
                            <div className="mt-2 w-full">
                                <input
                                    {...register('email', {
                                    onChange: (e) => setEmail(e.target.value)
                                    })}
                                    value={email}
                                    id='email'
                                    type='email'
                                    placeholder="email"
                                    className="block w-full rounded-md border-indigo-400 border-2 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>
                        <div className="flex w-full justify-center">
                            <button
                            type="submit"
                            className="flex w-3/5 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                            Confirm
                            </button>
                        </div>
                        </form>
                    </div>
                </div>
              )}
              {enviado && (
                <div className="space-y-3 flex flex-col items-center">
                    <h1 className="font-bold text-2xl">Verifique sua caixa de entrada e seu spam.</h1>
                    <p>Enviamos um codigo para redefinição de senha.</p>
                    <div className="mt-2 w-3/4">
                        <input
                            onChange={(e) => setCode(e.target.value)}
                            value={code}
                            id='code'
                            type='text'
                            placeholder="code"
                            className="block w-full rounded-md border-indigo-400 border-2 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                    </div>
                    <button
                        onClick={() => confirmCode()}
                        className="flex w-3/5 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                        Confirm
                    </button>
                </div>
              )}
            </div>
    )
  }