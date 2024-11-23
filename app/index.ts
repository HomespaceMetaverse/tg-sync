import { config } from 'dotenv';

config({ path: '.env.local' });

import { Express } from 'express';
import server from './server';
import { Logger } from '../middleware';
import { connect } from '../config/database';

export default async ({ expressApp }: { expressApp: Express }): Promise<void> => {
  const { Instance: logger } = Logger;

  await connect();
  logger.info('✌️ MongoDB loaded');

  await server({ app: expressApp });
  logger.info('✌️ Express loaded');
};
