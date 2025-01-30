import { Module } from '@nestjs/common';
import { EventController } from './controllers/event.controller';
import { EventService } from './services/event.service';
import { connectMongoDB, connectRedis } from './config/db.config';

@Module({
  imports: [],
  controllers: [EventController],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const redisClient = await connectRedis();
        return redisClient;
      }
    },
    EventService
  ],
})
export class AppModule {
  constructor() {
    this.initDatabase();
  }

  async initDatabase() {
    try {
      await connectMongoDB();
    } catch (error) {
      console.error('数据库初始化失败:', error);
    }
  }
}
