import { Socket } from 'socket.io';
import { getSocketArgs } from '../../../utils';
import { KEY, SOCKET_EVENT } from './utils';
import { Logger } from '../../../middleware';

export const getCoin = async (event: SOCKET_EVENT, args: any[], socket: Socket) => {
  try {
    const [token, eventName] = getSocketArgs(event, args, socket, [KEY.token, KEY.eventName]);
    if (!token || !eventName) {
      const err = 'token or eventName was not presented';
      socket.emit(event, { error: err });
      Logger.Instance.error(err);
      return;
    }
    const userId = null; // await getTokenAndUser(token, socket, event);
    if (userId) {
      const eventWithCoins = null; //await getEventWithCoins(eventName, userId);

      if (eventWithCoins) {
        socket.emit(event, {
          eventName: null, //eventWithCoins.name,
          coinCounter: null, //eventWithCoins.properties.totalCoins || 0,
        });
      } else {
        socket.emit(event, { error: `Can't find any events with coins for user: ${userId}` });
      }
    } else {
      const err = `cant't get coins for event: ${eventName}, user with id: ${userId}`;
      socket.emit(event, { error: err });
      Logger.Instance.error(err);
    }
  } catch (error) {
    Logger.Instance.error((error as Error).message);
  }
};
