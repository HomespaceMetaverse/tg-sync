import TelegramBot, { Message } from 'node-telegram-bot-api';
import { tgChannelMessageQueue } from '../../utils/queue';
import { Logger } from '../../middleware';

const { TELEGRAM_BOT_TOKEN: botToken, TELEGRAM_CHAT_ID: chatId } = process.env;


if (!botToken || !chatId) {
  Logger.Instance.error('Telegram bot token or Telegram chat id in .env not set');
  throw new Error('Telegram bot token or Telegram chat id in .env not set');
}

export const bot = new TelegramBot(botToken, {
  polling: true,
});

bot.on('channel_post', async (msg: Message) => {
  if (msg?.chat.id !== Number(chatId)) return;

  await tgChannelMessageQueue.add(msg);
});
