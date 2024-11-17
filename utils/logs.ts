export function parse(str: string, ...args: any[]) {
  args.forEach((arg: any, index: number) => {
    const regex = new RegExp(`%s${index}`, 'g');
    str = str.replace(regex, arg);
  });

  return str;
}

export const SERVER_PORT = '{"port": "%s0", "msg": "Server listening on port %s0"}';
export const ORIGIN = '{"origin": "%s0"}';
export const CONNECT_DB_ERROR = '{"msg": "Database connection failed. Exiting now..."}';
export const CONNECT_DB_SUCCESS = '{"msg": "Successfully connected to database"}';
