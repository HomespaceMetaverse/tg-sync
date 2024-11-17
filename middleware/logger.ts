import winston, { format, Logform } from 'winston';
import { NextFunction, Request, Response } from 'express';
import { isEmptyObject, parseStringToJson } from '../utils/is-object-empty';

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({ filename: 'error.log', level: 'error' }),
];

export const formatJson = format.printf(
  ({ level, message, timestamp, ...metadata }: Logform.TransformableInfo) => {
    let msg = '';
    if (level && timestamp) {
      msg = `${timestamp} [${level}] : ${message} `;
    }
    if (!isEmptyObject(metadata)) {
      msg += JSON.stringify(metadata);
    }
    return msg;
  }
);

const formatJsonForGrafana = format.printf(
  ({ level, message, timestamp, ...metadata }: Logform.TransformableInfo) => {
    let msgObject = {};
    if (level && timestamp) {
      // eslint-disable-next-line no-control-regex
      const regex = /[32M | 39M | \\u001b | [ | \]]/gi;
      let trimmedLevel = level.replaceAll(regex, '').toUpperCase().toString();
      msgObject = {
        level: `[${trimmedLevel}]`,
        timestamp,
        message: parseStringToJson(message as any),
      };
    }
    if (!isEmptyObject(metadata)) {
      msgObject = { ...msgObject, ...metadata };
    }
    return JSON.stringify(msgObject);
  }
);

export const Instance = winston.createLogger({
  level: 'silly',
  handleExceptions: true,
  exitOnError: false,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.colorize(),
    formatJsonForGrafana
  ),
  transports,
});

interface LoggerMessage {
  type: 'request' | 'response';
  protocol: string;
  url: string;
  method: string;
  headers?: Request['headers'];
  code?: number;
  message?: string;
  body?: Request['body'];
  params?: Request['params'];
  query?: Request['query'];
}

const removeUndefined = (obj: object) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value != null));
};

export const requestMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { httpVersion, method, protocol, hostname, url, headers, body, params, query } = req;

  const message: LoggerMessage = {
    type: 'request',
    protocol: `HTTP/${httpVersion}`,
    method,
    url: `${protocol}://${hostname}${url}`,
    headers,
    body: removeUndefined(body),
    params: removeUndefined(params),
    query,
  };
  Instance.info(message);

  next();
};

export const responseMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { httpVersion, method, protocol, hostname, url } = req;
  const { statusCode, statusMessage } = res;

  let message: LoggerMessage = {
    type: 'response',
    code: statusCode,
    message: statusMessage,
    protocol: `HTTP/${httpVersion}`,
    method,
    url: `${protocol}://${hostname}${url}`,
  };

  if (statusCode?.toString().match(/20[01]/)) {
    Instance.info(message);
  } else {
    Instance.error(message);
  }

  next();
};
