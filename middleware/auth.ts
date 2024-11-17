import { NextFunction, Request, Response } from 'express';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const bearerHeader = req.headers.authorization;

  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    const [, token] = bearer;

    if (!token) {
      return res.status(403).send({ error: 'A token is required for authentication' });
    }

    try {
      // const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as jwt.JwtPayload;
      //   req.user = { ...req.user, ...decoded };
      req.user = { ...req.user, token };
    } catch (err) {
      return res.status(401).send({ error: (err as Error).message });
    }
  } else {
    return res.status(403).send({
      error: 'An authorization header is required for authentication',
    });
  }
  return next();
};
