import { Schema, model } from 'mongoose';
import { UETokenModel, UETokenDocument } from './token.model';

const UETokenSchema = new Schema<UETokenDocument, UETokenModel>({
  token: String,
  createdAt: Date,
  sessionId: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    default: null,
  },
});

export default model<UETokenDocument, UETokenModel>('UEToken', UETokenSchema);
