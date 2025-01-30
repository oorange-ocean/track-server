import { config } from 'dotenv';
import { connect } from 'mongoose';
import { Redis } from 'ioredis';

config();

// MongoDB 连接
export const connectMongoDB = async () => {
  try {
    await connect(process.env.MONGODB_URI as string);
    console.log('MongoDB 连接成功');
  } catch (error) {
    console.error('MongoDB 连接失败:', error);
    process.exit(1);
  }
};

// Redis 连接（可选）
export const connectRedis = async () => {
  // 如果没有配置 Redis，直接返回 null
  if (!process.env.REDIS_HOST) {
    console.log('未配置 Redis，跳过 Redis 连接');
    return null;
  }

  try {
    const redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0'),
      retryStrategy: (times) => {
        if (times > 3) {
          console.log('Redis重试次数超过3次，放弃连接');
          return null;
        }
        return Math.min(times * 200, 1000);
      },
      maxRetriesPerRequest: 3
    });

    redisClient.on('error', (err: Error & { code?: string }) => {
      if (err.code === 'ECONNREFUSED') {
        console.log('Redis服务未启动，将以无Redis模式运行');
        redisClient.disconnect();
      }
    });

    return redisClient;
  } catch (error) {
    console.warn('Redis连接失败，将以无Redis模式运行:', error instanceof Error ? error.message : String(error));
    return null;
  }
}; 