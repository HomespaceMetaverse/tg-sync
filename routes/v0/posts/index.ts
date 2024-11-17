import express from 'express';
import { validateTgPostPagination } from './validation';
const router = express.Router();

import getPost from './get-post';

const backendUrl = ``;

router.get(`${backendUrl}/get-posts`, validateTgPostPagination, getPost);
export default router;
