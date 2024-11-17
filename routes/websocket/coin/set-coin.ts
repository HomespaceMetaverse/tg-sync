import { Socket } from 'socket.io';
import { getSocketArgs } from '../../../utils';
import { KEY, SOCKET_EVENT } from './utils';
import { Logger } from '../../../middleware';

export const setCoin = async (event: SOCKET_EVENT, args: any[], socket: Socket) => {
  try {
    const [token, eventName, coin] = getSocketArgs(event, args, socket, [
      KEY.token,
      KEY.eventName,
      KEY.coin,
    ]);
    if (!token || !eventName || !coin) {
      const err = 'token or eventName or coin was not presented';
      socket.emit(event, { error: err });
      Logger.Instance.error(err);
      return;
    }
    const userId = null;
    if (userId) {
      const eventWithCoins = null;
      if (eventWithCoins) {
        socket.emit(event, {
          eventName: null, //eventWithCoins.name,
          coinCounter: null, //eventWithCoins?.properties.totalCoins || 0,
        });
      } else {
        socket.emit(event, {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          error: `Can't set ${eventWithCoins?.properties?.totalCoins} 
            coins for event ${event} with user: ${userId}`,
        });
      }
    } else {
      const err = `cant't set ${coin} coins for event: ${eventName}, user with id: ${userId}`;
      socket.emit(event, { error: err });
      Logger.Instance.error(err);
    }
  } catch (error) {
    Logger.Instance.error((error as Error).message);
  }
};
