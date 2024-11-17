// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import loadApp from './app';
import { Logger } from './middleware';
import TokenModel from './models/token';
import { sendToken, getSocketArgs, isTokenExpired, KEY } from './utils';

import { parse, SERVER_PORT } from './utils/logs';
import { getCoin, setCoin } from './routes/websocket';

const SOCKET_TOKEN_EXPARATION_TIME = 24 * 60 * 60 * 1000; //24hours
const SOCKET_INACTIVITY_TIME = 5 * 60 * 1000; // 5min

let io: SocketIOServer;

export const initSocket = (server: http.Server) => {
  io = new SocketIOServer(server);
};

export enum SOCKET_EVENT {
  GET_TOKEN = 'get-token',
  GET_USER = 'get-user',
  GET_COIN = 'get-coin',
  SET_COIN = 'set-coin',
}

export const getIo = () => {
  try {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }

    Logger.Instance.info('Socet.io initialized!');
    return io;
  } catch (error) {
    Logger.Instance.error((<Error>error).message);
    return null;
  }
};

(async () => {
  try {
    const app = express();

    await loadApp({ expressApp: app });

    const server = http.createServer(app);

    initSocket(server);
    const io = getIo();

    io?.sockets.on('connection', socket => {
      let timeout: NodeJS.Timeout;

      socket.on('get-token', async message => {
        const currentToken = await TokenModel.findOne({ sessionId: socket.id }).lean().exec();

        if (currentToken) {
          const currentTime = new Date().getTime();
          const tokenCreatedTime = currentToken.createdAt.getTime();
          const isTokenNotExpired = currentTime - tokenCreatedTime > SOCKET_TOKEN_EXPARATION_TIME;

          if (!isTokenNotExpired) {
            socket.emit('get-token', { token: currentToken.token, sessionId: socket.id });
          } else {
            await sendToken(socket);
          }
        } else {
          const token = jwt.sign(
            {
              sessionId: socket.id,
            },
            process.env.JWT_REFRESH_SECRET as string,
            {
              expiresIn: '1d',
            }
          );
          const newToken = new TokenModel({ token, createdAt: new Date(), sessionId: socket.id });
          await newToken.save();
          socket.emit('get-token', { token, sessionId: socket.id });
        }

        // Setup inactivity disconnect
        clearTimeout(timeout);
        timeout = setTimeout(() => socket.disconnect(true), SOCKET_INACTIVITY_TIME);
      });

      socket.use(async ([event, ...args], next) => {
        switch (event) {
          case SOCKET_EVENT.GET_TOKEN:
            next();
            break;
          case SOCKET_EVENT.SET_COIN: {
            await setCoin(SOCKET_EVENT.SET_COIN, args, socket);
            next();
            return;
          }
          case SOCKET_EVENT.GET_COIN: {
            await getCoin(SOCKET_EVENT.GET_COIN, args, socket);
            next();
            return;
          }
          default: {
            const [token] = getSocketArgs(event, args, socket, [KEY.token]);
            const currentToken = await TokenModel.findOne({ token }).lean().exec();
            if (!currentToken) {
              return;
            }
            // Validate token
            await isTokenExpired(event, currentToken, socket);
            next();
            return;
          }
        }
        // Setup inactivity disconnect
        clearTimeout(timeout);
        timeout = setTimeout(() => socket.disconnect(true), SOCKET_INACTIVITY_TIME);
      });
    });

    app
      .listen(process.env.PORT_SERVER, () => Logger.Instance.info(parse(SERVER_PORT, 3003)))
      .on('error', err => {
        Logger.Instance.error(err);
        process.exit(1);
      });

    server
      .listen(process.env.PORT_SOCKET, () => Logger.Instance.info(parse(SERVER_PORT, 4433)))
      .on('error', err => {
        Logger.Instance.error(err);
        process.exit(1);
      });
  } catch (error) {
    console.error(error);
  }
})();
