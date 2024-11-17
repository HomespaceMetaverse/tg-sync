import { Document, Model } from 'mongoose';
import TelegramBot from 'node-telegram-bot-api';

export interface TgPhoto extends TelegramBot.PhotoSize {
  src: string;
}

export interface TgVideo extends TelegramBot.Video {
  src: string;
  thumb: TgPhoto;
  thumbnail: TgPhoto;
}

export interface TgAudio extends TelegramBot.Audio {
  src: string;
}

export interface TgDocument extends TelegramBot.Document {
  src: string;
}

export interface ITgPost {
  text?: string;
  chatId: number;
  messageId: number;
  mediaGroupId?: string;
  caption?: string;
  photo: TgPhoto[];
  video: TgVideo[];
  audio: TgAudio[];
  document: TgDocument[];
}

export interface ITgPostDocument extends Document, ITgPost {}

export type TgPostModel = Model<ITgPostDocument>;
