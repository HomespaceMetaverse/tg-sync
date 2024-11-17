import { Request, Response, NextFunction } from 'express';
import { getTgCommentByPaginations } from '../../../src/comments/comment-service';
import { GetCommentByPaginationDto } from './dto/get-comment-pagination.dto';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query: GetCommentByPaginationDto = req.query as unknown as GetCommentByPaginationDto;

    const limit = +query.limit || 15;
    const offset = +query.offset || 0;

    const result = await getTgCommentByPaginations({
      ...query,
      limit,
      offset,
    });

    res.send(result);
  } catch (error) {
    next(error);
  }
};
