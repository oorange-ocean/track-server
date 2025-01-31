import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 配置根路由处理
  app.use('/', (req, res, next) => {
    if (req.url === '/') {
      return res.send('Hello World!');
    }
    next();
  });
  
  // 配置全局前缀（仅对 /api 开头的路由生效）
  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });
  
  // 配置 CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // 配置全局管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  
  // 配置 Helmet（安全相关的 HTTP 头）
  app.use(helmet());
  
  // 配置速率限制
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: parseInt(process.env.RATE_LIMIT) || 100, // 限制每个IP的请求数
    }),
  );
  
  // 添加全局日志中间件
  app.use((req, res, next) => {
    Logger.log(`${req.method} ${req.url}`, 'Request');
    next();
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
