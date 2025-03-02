'use client'

import { useForm } from 'react-hook-form'
import Button from '../../components/Button'
import Checkbox from '../../components/CheckBox'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '@/app/contexts/AuthContext'

export default function FirstPage(){

  const { register, handleSubmit } = useForm();

  const { error, signIn } = useContext(AuthContext);

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isChecked, setIsChecked] = useState(false)
  const [timeToken, setTimeToken] = useState("1h")

  async function SignIn(){
    console.log(isChecked, timeToken)
    await signIn({email, password, timeToken})
  }

  useEffect(() => {
    if(isChecked) setTimeToken("30d"); else setTimeToken("1h")
  }, [isChecked])

  useEffect(() => {
    if (error){
      alert("incorrect email or password!!!")
      setEmail("")
      setPassword("")
    } 
  }, [error])

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <form onSubmit={handleSubmit(SignIn)} className='flex flex-col items-center justify-around h-1/2 w-2/5'>
        <h1 className='mb-4 text-5xl font-bold text-white'>Roxyall Control</h1>
        <input
        
        {...register('email', {
          onChange: (e) => setEmail(e.target.value)
        })}
        value={email}
        id='email'
        type='email'
        placeholder="email"
        className="w-3/4 p-1 m-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <input
        {...register('password', {
          onChange: (e) => setPassword(e.target.value)
        })}
        value={password}
        id='password'
        type='password' 
        placeholder="password"
        className="w-3/4 p-1 m-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <div className='flex justify-between w-3/4'>
          <Checkbox name='aceito' label='Remember me' isChecked={isChecked} onChange={(e) => setIsChecked(e.target.checked)}/>
          <a href='#' className='text-blue-500 hover:text-blue-700'>Forgot your password?</a>
        </div>
        <Button text="Sign In"></Button>
      </form>
    </div>
  )
}