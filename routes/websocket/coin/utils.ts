export enum SOCKET_EVENT {
  GET_TOKEN = 'get-token',
  GET_USER = 'get-user',
  GET_COIN = 'get-coin',
  SET_COIN = 'set-coin',
}
export enum KEY {
  token = 'token',
  coin = 'coin',
  eventName = 'eventName',
}

export type Key = keyof typeof KEY;

export type AllKeys = {
  [KEY.token]: string;
  [KEY.coin]: number;
  [KEY.eventName]: string;
};
