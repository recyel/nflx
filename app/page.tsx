'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { generateRandomString } from '../utils/random-string'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const payment_id = generateRandomString(48)
    const user_id = generateRandomString(16)
    router.push(`/payment_id=${payment_id}&userid=${user_id}`)
  }, [router])

  return null // This page won't render anything, it just redirects
}

