'use client'

import { AuthContext } from "@/app/contexts/AuthContext"
import { useContext, useEffect, useState } from "react"


export default function Dashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { user } = useContext(AuthContext)
  const [saldo, setSaldo] = useState(0.0)

  useEffect(() => {
    fetch('/api/calculaSaldo')
     .then(response => response.json())
     .then(data => setSaldo(data.saldo))
     .catch(error => console.error('Error:', error))
  })

  return (
    <div></div>
  )
}
