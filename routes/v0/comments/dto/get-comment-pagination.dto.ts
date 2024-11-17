import { ObjectId } from 'mongoose';

export class GetCommentByPaginationDto {
  limit: number;
  offset: number;
  postId: ObjectId;
  authorId?: string;
}
