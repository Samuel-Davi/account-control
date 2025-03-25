'use client'

import { useForm } from 'react-hook-form'
import Checkbox from '../../components/CheckBox'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Loading from '@/app/components/Loading'

export default function FirstPage(){

  const { register, handleSubmit } = useForm();

  const {success, setSuccess, error, signIn } = useContext(AuthContext);

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isChecked, setIsChecked] = useState(false)
  const [timeToken, setTimeToken] = useState("1h")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  async function SignIn(){
    setLoading(true)
    await signIn({email, password, timeToken})
  }

  useEffect(() => {
    if(isChecked) setTimeToken("30d"); else setTimeToken("1h")
  }, [isChecked])

  useEffect(() => {
    if (error){
      alert("incorrect email or password!!!")
      setLoading(false)
      setEmail("")
      setPassword("")
    } 
  }, [error])

  useEffect(() => {
    if(success) {
      setLoading(false)
      setSuccess(false)
    }
  }, [success])

  return (
    <div className="flex min-h-full items-center flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 w-4/5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit(SignIn)} className="space-y-6">
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
                {/*<div className="text-sm">
                  <a onClick={() => {
                    alert("")
                  }} className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>*/}
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
            
            <div className='flex justify-between w-full'>
              <Checkbox name='aceito' label='Remember me' isChecked={isChecked} onChange={(e) => setIsChecked(e.target.checked)}/>
              <span onClick={() => {router.push('/register')}} className="text-sm font-semibold underline text-indigo-600 hover:text-indigo-500 cursor-pointer" >Not a user?</span>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
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