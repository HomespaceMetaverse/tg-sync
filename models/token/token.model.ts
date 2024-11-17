import { Document, Model, Types } from 'mongoose';

export interface UEToken {
  token: string;
  createdAt: Date;
  sessionId: string;
  userId: Types.ObjectId;
}

export interface UETokenDocument extends Document, UEToken {}

export type UETokenModel = Model<UETokenDocument>;
