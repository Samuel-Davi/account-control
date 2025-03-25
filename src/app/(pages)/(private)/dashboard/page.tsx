'use client'

import Chart from "@/app/components/Chart"
import Loading from "@/app/components/Loading"
import { AuthContext } from "@/app/contexts/AuthContext"
import { useContext, useEffect, useState } from "react"

export default function Dashboard() {

  const { user } = useContext(AuthContext)
  const [loading , setLoading] = useState(false)

  useEffect(() => {
    if(!user) setLoading(true)
    else setLoading(false)  
  }, [])

  useEffect(() => {
    if(!user) setLoading(true)
    else setLoading(false)  
  }, [user])

  return (
    <div className="flex h-full flex-col justify-around items-center">
      <h1 className="text-2xl">Bem vindo(a) {user?.name}</h1>

      <div className="h-3/4">
        <Chart/>
      </div>

      {loading && (<Loading/>)} 
    </div>
  )
}
