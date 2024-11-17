import express, { Application } from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import oauthRouter from '../routes/v0/auth';
import postsRouter from '../routes/v0/posts';
import commentsRouter from '../routes/v0/comments';
import '../src/events/events';

import { errorHandler, notFoundHandler, Logger } from '../middleware';

import { parse, ORIGIN } from '../utils/logs';
import passport from 'passport';

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    Logger.Instance.info(parse(ORIGIN, origin));
    callback(null, true);
  },
  credentials: true,
  exposedHeaders: ['set-cookie'],
};

const apiVersion = '/v0';
const serverString = `/api${apiVersion}`;

export default async ({ app }: { app: Application }): Promise<void> => {
  // Middlewares
  app.disable('x-powered-by');
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json({ limit: '1mb' }));
  app.use(passport.initialize());
  // app.use(
  //   session({
  //     resave: false,
  //     saveUninitialized: true,
  //     secret: process.env.SESSION_SAULT as string,
  //   })
  // );
  // passport.serializeUser((user, done) => {
  //   done(null, user);
  // });
  // passport.deserializeUser((obj, done) => {
  //   done(null, obj as any);
  // });

  app.use(`${serverString}/auth`, oauthRouter);
  app.use(`${serverString}/posts`, postsRouter);
  app.use(`${serverString}/comments`, commentsRouter);

  app.use(Logger.requestMiddleware);

  app.use(notFoundHandler);

  app.use(errorHandler);
  app.use(Logger.responseMiddleware);
};
