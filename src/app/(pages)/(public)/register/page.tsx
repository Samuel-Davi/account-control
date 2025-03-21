'use client'

import { AuthContext } from "@/app/contexts/AuthContext";
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/Loading";

export default function SignUp(){

  const { register, handleSubmit } = useForm();

  const {setSuccess, success,  error , signUp } = useContext(AuthContext)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  async function SignUp(){
    setLoading(true)
    await signUp({name, email, password})
  }

  useEffect(() => {
      if (error){
        setLoading(false)
        alert("Usuário com esse email ja existente!!!")
        setName("")
        setEmail("")
        setPassword("")
      } 
    }, [error])

    useEffect(() => {
      if(success) {
        setLoading(false)
        alert("Usuário cadastrado com sucesso!!!")
        setSuccess(false)
      }
    }, [success])

    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
              <div className="fixed top-4 left-4">
                <button onClick={() => router.push('/') } className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" 
                  >Voltar
                  </button>
              </div>
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                  alt="Your Company"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  className="mx-auto h-10 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                  Sign Up
                </h2>
              </div>
      
              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit(SignUp)} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                      Name
                    </label>
                    <div className="mt-2">
                      <input
                        {...register('name', {
                          onChange: (e) => setName(e.target.value)
                        })}
                        value={name}
                        id='name'
                        type='name'
                        placeholder="name"
                        className="block w-full rounded-md border-indigo-400 border-2 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                      Email address
                    </label>
                    <div className="mt-2">
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
      
                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                        Password
                      </label>
                    </div>
                    <div className="mt-2">
                      <input
                        {...register('password', {
                          onChange: (e) => setPassword(e.target.value)
                        })}
                        value={password}
                        id='password'
                        type='password' 
                        placeholder="password"
                        className="block w-full rounded-md border-indigo-400 border-2 bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2  focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
      
                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              </div>
              {loading && (
                  <Loading/>
              )}
            </div>
    )
  }