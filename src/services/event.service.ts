import { Injectable, Inject } from '@nestjs/common';
import { Event } from '../models/event.model';
import { Redis } from 'ioredis';

@Injectable()
export class EventService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis
  ) {}

  async trackEvent(eventData: any) {
    try {
      // 保存到 MongoDB
      const event = new Event(eventData);
      await event.save();

      // 保存到 Redis 用于实时统计
      const redisKey = `events:${eventData.projectId}:${eventData.eventName}`;
      await this.redisClient.incr(redisKey);
      
      return { success: true, message: '事件追踪成功' };
    } catch (error) {
      throw new Error(`事件追踪失败: ${error.message}`);
    }
  }
} 