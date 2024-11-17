import { Logger } from '../../middleware';
import { ITgPostDocument, ITgPost } from '../../models/post/post.model';
import TgPostModel from '../../models/post';
import { GetPostByPaginationDto } from '../../routes/v0/posts/dto/get-post-paginatio.dto';
import { ObjectId } from 'mongoose';

const { Instance: logger } = Logger;

export const createOrUpdateTgPost = async (post: ITgPost): Promise<ITgPostDocument | null> => {
  try {
    if (post.mediaGroupId) {
      const existingPost = await TgPostModel.findOne({
        mediaGroupId: post.mediaGroupId,
      });

      if (existingPost) {
        existingPost.photo = existingPost.photo.concat(post.photo);
        existingPost.video = existingPost.video.concat(post.video);
        existingPost.audio = existingPost.audio.concat(post.audio);
        existingPost.document = existingPost.document.concat(post.document);

        await existingPost.save();

        return existingPost.toObject();
      }
    }

    const newPost = new TgPostModel(post);

    const savedPost = await newPost.save();

    return savedPost.toObject();
  } catch (err) {
    logger.error(err);
    return null;
  }
};

export const getTgPostByPaginations = async (query: GetPostByPaginationDto) => {
  try {
    const totalItems = await TgPostModel.countDocuments();
    const result = await TgPostModel.find({}).skip(query.offset).limit(query.limit);

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

export const getTgPostById = async (_id: ObjectId): Promise<ITgPostDocument | null> => {
  try {
    const findPost = await TgPostModel.findOne({
      _id,
    });

    return findPost;
  } catch (error) {
    logger.error((<Error>error).message);
    return null;
  }
};
