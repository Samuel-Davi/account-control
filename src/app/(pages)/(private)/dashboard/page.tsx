'use client'

import { AuthContext } from "@/app/contexts/AuthContext"
import { api } from "@/app/services/api"
import { parseCookies } from "nookies"
import { useContext, useEffect } from "react"

export default function Dashboard(){

    const { user } = useContext(AuthContext)


    return (
        <div>Dashboard</div>
    )
}