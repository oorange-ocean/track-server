import { Module } from '@nestjs/common';
import { EventController } from './controllers/event.controller';
import { EventService } from './services/event.service';
import { connectMongoDB, connectRedis } from './config/db.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportController } from './controllers/report.controller';
import { ReportService } from './services/report.service';
import { Report, ReportSchema } from './schemas/report.schema';
import { ErrorMonitorController } from './controllers/error-monitor.controller';
import { ErrorMonitorService } from './services/error-monitor.service';
import { PerformanceMonitorController } from './controllers/performance-monitor.controller';
import { PerformanceMonitorService } from './services/performance-monitor.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([
      { name: Report.name, schema: ReportSchema },
    ]),
  ],
  controllers: [EventController, AppController, ReportController, ErrorMonitorController, PerformanceMonitorController],
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
    AppService,
    ReportService,
    ErrorMonitorService,
    PerformanceMonitorService,
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
