import { Logger } from '../../middleware';
import TgCommentModel from '../../models/comment';
import { ITgCommentDocument } from '../../models/comment/comment.model';
import { ObjectId } from 'mongoose';
import { CreateTgCommentDto } from '../../routes/v0/comments/dto/create-comment.dto';
import { GetCommentByPaginationDto } from '../../routes/v0/comments/dto/get-comment-pagination.dto';

const { Instance: logger } = Logger;

export const createTgComment = async (data: CreateTgCommentDto): Promise<ITgCommentDocument | Error> => {
  try {
    const newComment = new TgCommentModel(data);
    const savedPost = await newComment.save();

    return savedPost.toObject();
  } catch (error) {
    logger.error((<Error>error).message);
    throw Error((<Error>error).message);
  }
};

export const getTgCommentByPaginations = async (query: GetCommentByPaginationDto) => {
  try {
    const totalItems = await TgCommentModel.countDocuments();

    interface IWhereCause {
      postId: ObjectId;
      authorId?: string;
    }

    const whereCause: IWhereCause = {
      postId: query.postId,
    };

    if (query.authorId) whereCause.authorId = query.authorId;

    const result = await TgCommentModel.find(whereCause).skip(query.offset).limit(query.limit);

    const totalPages = Math.ceil(totalItems / query.limit);

    return {
      totalItems,
      totalPages,
      rows: result,
    };
  } catch (error) {
    logger.error((<Error>error).message);
    throw Error((<Error>error).message);
  }
};
