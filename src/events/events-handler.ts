import { Message } from 'node-telegram-bot-api';
import { ITgPost, TgAudio, TgDocument, TgPhoto, TgVideo } from '../../models/post/post.model';
import { createOrUpdateTgPost } from '../posts/post-service';
import { bot } from './events';

const { TELEGRAM_BOT_TOKEN: botToken } = process.env;

export async function handleNewMessage(msg: Message) {
  const newData: ITgPost = {
    text: msg?.text,
    chatId: msg.chat.id,
    messageId: msg.message_id,
    caption: msg?.caption,
    mediaGroupId: msg?.media_group_id,
    photo: [],
    video: [],
    document: [],
    audio: [],
  };

  if (msg.photo) {
    const lastPicture = msg.photo.at(-1) as TgPhoto;

    const { file_path } = await bot.getFile(lastPicture.file_id);
    if (file_path) lastPicture.src = `https://api.telegram.org/file/bot${botToken}/${file_path}`;

    newData.photo.push(lastPicture);
  }

  if (msg.video) {
    const video = msg.video as TgVideo;

    video.src = await getFileSrc(video.file_id);
    if (video.thumb?.file_id) {
      video.thumb.src = await getFileSrc(video.thumb?.file_id);
    }

    newData.video.push(video);
  }

  if (msg.audio) {
    const audio = msg.audio as TgAudio;

    audio.src = await getFileSrc(audio.file_id);
    newData.audio.push(audio);
  }

  if (msg.document) {
    const document = msg.document as TgDocument;

    document.src = await getFileSrc(document.file_id);
    newData.document.push(document);
  }

  const newPost = await createOrUpdateTgPost(newData);
  return newPost;
}

async function getFileSrc(fileId: string): Promise<string> {
  const { file_path } = await bot.getFile(fileId);
  return `https://api.telegram.org/file/bot${botToken}/${file_path}`;
}
