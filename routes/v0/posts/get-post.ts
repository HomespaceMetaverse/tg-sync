import { GetPostByPaginationDto } from './dto/get-post-paginatio.dto';
import { Request, Response, NextFunction } from 'express';
import { getTgPostByPaginations } from '../../../src/posts/post-service';

export default async (req: Request, res: Response, next: NextFunction) => {
  const query: GetPostByPaginationDto = req.query as unknown as GetPostByPaginationDto;

  try {
    const limit = +query.limit || 15;
    const offset = +query.offset || 0;

    const result = await getTgPostByPaginations({
      limit,
      offset,
    });

    res.send(result);
  } catch (error) {
    next(error);
  }
};
