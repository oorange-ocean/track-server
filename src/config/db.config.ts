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

// Redis 连接
export const connectRedis = async () => {
  try {
    const redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0'),
    });

    redisClient.on('error', (err) => console.error('Redis 错误:', err));
    redisClient.on('connect', () => console.log('Redis 连接成功'));

    // 测试连接
    await redisClient.ping();
    return redisClient;
  } catch (error) {
    console.error('Redis 连接失败:', error);
    process.exit(1);
  }
}; 