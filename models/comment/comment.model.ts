import { Document, Model, ObjectId } from 'mongoose';

export interface ITgComment {
  text: string;
  authorId: string;
  postId: ObjectId;
}

export interface ITgCommentDocument extends Document, ITgComment {}

export type TgCommentModel = Model<ITgCommentDocument>;
