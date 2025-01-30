import { Controller, Post, Body, Logger } from '@nestjs/common';
import { EventService } from '../services/event.service';

@Controller('track')
export class EventController {
  private readonly logger = new Logger(EventController.name);

  constructor(private readonly eventService: EventService) {}

  @Post('event')
  async trackEvent(@Body() eventData: any) {
    this.logger.log('收到追踪请求');
    return await this.eventService.trackEvent(eventData);
  }
} 