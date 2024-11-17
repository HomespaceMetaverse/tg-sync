import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateTgCommentPagination = [
  check('limit')
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be a positive integer and no more than 50.'),
  check('offset').isInt({ min: 0 }).withMessage('Offset must be a non-negative integer.'),
  check('authorId').optional(),
  check('postId')
    .not()
    .isEmpty()
    .withMessage('Post ID is required.')
    .isMongoId()
    .withMessage('Post ID must be a valid MongoDB ObjectId.'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateCreateTgComment = [
  check('authorId').not().isEmpty().withMessage('Author ID is required.'),
  check('postId')
    .not()
    .isEmpty()
    .withMessage('Post ID is required.')
    .isMongoId()
    .withMessage('Post ID must be a valid MongoDB ObjectId.'),
  check('text').not().isEmpty().withMessage('Text is required.'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
