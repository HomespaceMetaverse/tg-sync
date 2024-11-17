import { model, Schema } from 'mongoose';
import { ITgCommentDocument, TgCommentModel } from './comment.model';

const TgCommentShema = new Schema<ITgCommentDocument, TgCommentModel>({
  text: String,
  authorId: {
    type: String,
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'TgPost',
  },
});

export default model<ITgCommentDocument, TgCommentModel>('TgComment', TgCommentShema);
