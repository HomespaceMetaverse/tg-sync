import { CookieOptions } from 'express';

export const cookiesConfig: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
};

if (process.env.NODE_ENV === 'production') {
  cookiesConfig.domain = '.bb.dd'; // our domain
}
