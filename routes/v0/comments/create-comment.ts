import { NextFunction, Request, Response } from 'express';
import { createTgComment } from '../../../src/comments/comment-service';
import { CreateTgCommentDto } from './dto/create-comment.dto';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body as unknown as CreateTgCommentDto;

    const result = await createTgComment(body);
    res.send(result);
  } catch (error) {
    next(error);
  }
};
