export function isEmptyObject<T = Record<string, unknown>>(obj: T) {
  if (!obj) return true;
  return Object.keys(obj).length === 0 && (<Record<string, unknown>>obj)?.constructor === Object;
}

export function parseStringToJson<T = Record<string, unknown>>(str: string): string | T {
  try {
    return JSON.parse(str);
  } catch (error) {
    return str;
  }
}
