import { Request, Response } from 'express';
import { Logger } from '../../../middleware';

export default async (req: Request, res: Response) => {
  try {
    Logger.Instance.info(JSON.stringify(req.body));
    res.status(200).send();
  } catch (error) {
    Logger.Instance.error((<Error>error).message);
    return res.status(400).send({ error: (<Error>error).message });
  }
};
