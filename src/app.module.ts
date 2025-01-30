import { Module } from '@nestjs/common';
import { EventController } from './controllers/event.controller';
import { EventService } from './services/event.service';
import { connectMongoDB, connectRedis } from './config/db.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [EventController, AppController],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        try {
          return await connectRedis();
        } catch (error) {
          console.warn('Redis连接失败，将以无Redis模式运行:', error.message);
          return null;
        }
      }
    },
    EventService,
    AppService
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
      console.error('MongoDB初始化失败:', error);
    }
  }
}
