'use client'

import { AuthContext } from "@/app/contexts/AuthContext"
import { api } from "@/app/services/api"
import { getCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import { parseCookies } from "nookies"
import { useContext, useEffect, useState } from "react"

type User = {
    email: string;
    name: string;
    avatarUrl: string;
}

export default function Dashboard(){

    const { user } = useContext(AuthContext)


    return (
        <div className="flex items-center justify-center h-screen">
            <img src={user?.avatarUrl} alt="foto" className="text-white h-12"/>
        </div>
    )
}