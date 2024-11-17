import { model, Schema } from 'mongoose';
import { ITgPostDocument, TgPostModel } from './post.model';

const TgPostShema = new Schema<ITgPostDocument, TgPostModel>({
  text: String,
  chatId: Number,
  messageId: Number,
  caption: String,
  mediaGroupId: String,
  photo: [
    {
      file_id: String,
      file_unique_id: String,
      file_size: Number,
      width: String,
      height: String,
      src: String,
    },
  ],
  video: [
    {
      duration: Number,
      width: String,
      height: String,
      file_name: String,
      mime_type: String,
      src: String,
      thumbnail: {
        file_id: String,
        file_unique_id: String,
        file_size: Number,
        width: String,
        height: String,
        src: String,
      },
      thumb: {
        file_id: String,
        file_unique_id: String,
        file_size: Number,
        width: String,
        height: String,
        src: String,
      },
      file_id: String,
      file_unique_id: String,
      file_size: Number,
    },
  ],
  audio: [
    {
      durantion: Number,
      file_name: String,
      mime_type: String,
      file_id: String,
      file_unique_id: String,
      file_size: Number,
      src: String,
    },
  ],
  document: [
    {
      file_name: String,
      mime_type: String,
      file_id: String,
      file_unique_id: String,
      file_size: Number,
      src: String,
    },
  ],
});

export default model<ITgPostDocument, TgPostModel>('TgPost', TgPostShema);
