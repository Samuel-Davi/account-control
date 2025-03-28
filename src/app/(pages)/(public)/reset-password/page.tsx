'use client'

import { api } from "@/app/lib/api"
import { useSearchParams } from "next/navigation"
import { FormEvent } from "react"
import { redirect } from "next/navigation"

export default function ResetPassword(){

    const searchParams = useSearchParams()
    const email = searchParams.get('email')

    const resetPassword = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        fetch(`${api}/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: formData.get('password')
            })
        })

        
    }

    return (
        <div className=" h-full flex flex-col justify-start items-center">
            <div className="fixed top-4 left-4">
                <button onClick={() => redirect('/') } className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" 
                  >Voltar
                  </button>
              </div>
            <h1 className="font-bold pt-12 text-2xl">Reset Password</h1>
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <h1 className="text-start w-full">New Password:</h1>
                <form className="space-y-6 flex flex-col items-center" onSubmit={resetPassword}>
                <input
                    className="block w-full rounded-md border-indigo-400 border-2 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"       
                    type="password"
                    name="password" 
                    id="password" 
                    placeholder="password" />
                    <button
                        type="submit"
                        className="flex w-3/5 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                        Confirm
                    </button>
                </form>
            </div>
        </div>
    )
}