import { Logger } from '../../../middleware';
import { getIo } from '../../../index';
import { ITgPostDocument } from '../../../models/post/post.model';

export const listenNewPost = async (post: ITgPostDocument) => {
  try {
    const io = getIo();

    io?.sockets.emit('listen-new-post', post);
  } catch (error) {
    Logger.Instance.error((<Error>error).message);
  }
};
