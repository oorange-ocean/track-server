import { connectMongoDB, connectRedis } from './config/db.config';

// 连接数据库
const initializeDatabase = async () => {
  await connectMongoDB();
  const redisClient = await connectRedis();
  return { redisClient };
};

// 启动应用
const startApp = async () => {
  try {
    const { redisClient } = await initializeDatabase();
    // 你的应用代码...
  } catch (error) {
    console.error('应用启动失败:', error);
    process.exit(1);
  }
};

startApp(); 