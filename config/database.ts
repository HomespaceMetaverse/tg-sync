import { Logger } from '../middleware';

const { Instance } = Logger;
import { connect as mongoConnect, MongooseError, ConnectOptions } from 'mongoose';

import { CONNECT_DB_SUCCESS, CONNECT_DB_ERROR } from '../utils/logs';

const { MONGO_CLUSTER_IP, MONGO_USERNAME, MONGO_PASSWORD } = process.env;

export const MONGO_CONNECTION_OPTIONS: ConnectOptions = {};
// eslint-disable-next-line max-len
// export const MONGO_CONNECTION_STRING = `mongodb+srv://${MONGO_CLUSTER_IP}/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority`;
// eslint-disable-next-line max-len
export const MONGO_CONNECTION_STRING = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER_IP}/?authSource=admin`;

export const connect = async () => {
  try {
    const mongoInstance = await mongoConnect(MONGO_CONNECTION_STRING, MONGO_CONNECTION_OPTIONS);
    Instance.info(CONNECT_DB_SUCCESS);
    return mongoInstance;
  } catch (error) {
    Instance.error(CONNECT_DB_ERROR);
    Instance.error(error as MongooseError);
    process.exit(1);
  }
};
