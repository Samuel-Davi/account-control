'use client'

import { AuthContext } from "@/app/contexts/AuthContext"
import { useContext } from "react"

export default function Dashboard() {

  const { user } = useContext(AuthContext)

  return (
    <div className="flex justify-center items-center">
      <h1>Bem vindo(a) {user?.name}</h1>
    </div>
  )
}
