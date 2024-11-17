import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateTgPostPagination = [
  check('limit')
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be a positive integer and no more than 50.'),
  check('offset').isInt({ min: 0 }).withMessage('Offset must be a non-negative integer.'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
