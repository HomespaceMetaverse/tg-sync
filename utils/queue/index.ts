import { Logger } from '../../middleware';
import Queue from 'bull';
import { handleNewMessage } from '../../src/events';
import { Message } from 'node-telegram-bot-api';
import { ObjectId } from 'mongoose';
import { getTgPostById } from '../../src/posts/post-service';
import { listenNewPost } from '../../routes/websocket';


async function checkRedisConnection(queue: Queue.Queue<any>) {
  try {
    await queue.isReady();
    console.log(`Successfully connected to Redis for queue: ${queue.name}`);
  } catch (error) {
    Logger.Instance.error(`Failed to connect to Redis for queue: ${queue.name}`, (<Error>error).message);
    process.exit(1); 
  }
}

export const tgChannelMessageQueue = new Queue<Message>('message processing', {
  redis: {
    host: 'redis',
    port: 6379,
  },
})

export const tgSendPostToListener = new Queue<ObjectId>('send new post to listener', {
  redis: {
    host: 'redis',
    port: 6379,
  },
});

// Проверка подключения к Redis для каждой очереди
checkRedisConnection(tgChannelMessageQueue);
checkRedisConnection(tgSendPostToListener);

/**
 * tgChannelMessageQueue
 */
tgChannelMessageQueue.process(async (job, done) => {
  try {
    const post = await handleNewMessage(job.data);

    if (post) {
      await tgSendPostToListener.add(post._id, {
        delay: 5 * 1000,
        jobId: post._id.toString(),
      });
    }

    done(null);
  } catch (error) {
    Logger.Instance.error((<Error>error).message);
    done(<Error>error);
  }
});

tgChannelMessageQueue.on('completed', error => {
  if (error) Logger.Instance.error(error);
  Logger.Instance.info(`Job completed with result`);
});

/**
 * tgSendPostToListener
 */
tgSendPostToListener.process(async (job, done) => {
  try {
    const post = await getTgPostById(job.data);
    if (post) listenNewPost(post);
    done(null);
  } catch (error) {
    Logger.Instance.error((<Error>error).message);
    done(<Error>error);
  }
});

const queue = [tgChannelMessageQueue, tgSendPostToListener];
for (const item of queue) {
  item.on('failed', (job, error) => {
    Logger.Instance.error('Job failed', error);
  });
}
