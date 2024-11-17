import { Socket } from 'socket.io';
import crypto from 'crypto';
import { UEToken } from './models/token/token.model';
import TokenModel from './models/token';
import { Logger } from './middleware';

const SOCKET_TOKEN_EXPARATION_TIME = 24 * 60 * 60 * 1000; //24hours

export const isValidJSON = <T>(obj: T) => {
  try {
    JSON.parse(JSON.stringify(obj));
    return true;
  } catch (e) {
    return false;
  }
};

export const isTokenExpired = async (event: string, currentToken: UEToken, socket: Socket) => {
  try {
    const isOutOfTime =
      !currentToken ||
      new Date().getTime() - currentToken.createdAt.getTime() > SOCKET_TOKEN_EXPARATION_TIME;
    if (isOutOfTime) {
      socket.emit(event, { error: 'token was expired, try to get another one' });
      return true;
    }
    return false;
  } catch (error) {
    Logger.Instance.error((<Error>error).message);
    return true;
  }
};

export enum KEY {
  token = 'token',
  coin = 'coin',
  eventName = 'eventName',
}

type AllKeys = {
  [KEY.token]: string;
  [KEY.coin]: number;
  [KEY.eventName]: string;
};

export const getSocketArgs = (event: string, args: Array<keyof AllKeys>, socket: Socket, keys: KEY[]) => {
  try {
    const isJson = isValidJSON<Array<keyof AllKeys>>(args);
    if (!isJson) {
      socket.emit(event, { error: 'Invalid message format. It should be JSON' });
      return [];
    }
    const parsedData = JSON.parse(JSON.stringify(args[0])) as AllKeys;

    // ! fix any
    const data = keys.reduce((acc, val) => {
      const value = parsedData[val];
      if (value) {
        acc.push(value);
      }
      return acc;
    }, [] as any[]);
    return data;
  } catch (error) {
    Logger.Instance.error((<Error>error).message);
    return [];
  }
};

export const sendToken = async (socket: Socket) => {
  try {
    const token = crypto.randomBytes(20).toString('hex');
    await TokenModel.findOneAndUpdate({ sessionId: socket.id }, { token, createdAt: new Date() });
    socket.emit('get-token', { token, sessionId: socket.id });
  } catch (error) {
    Logger.Instance.error((<Error>error).message);
    socket.emit('get-token', { error: (error as Error)?.message });
  }
  return;
};
