import express from 'express';
import { validateCreateTgComment, validateTgCommentPagination } from './validation';
const router = express.Router();

import getComment from '../comments/get-comment';
import createComment from '../comments/create-comment';

const backendUrl = ``;

router.get(`${backendUrl}/get-comments`, validateTgCommentPagination, getComment);
router.post(`${backendUrl}/create-comment`, validateCreateTgComment, createComment);
export default router;
