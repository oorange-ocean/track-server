import { Controller, Get, Query } from '@nestjs/common';
import { PerformanceMonitorService } from '../services/performance-monitor.service';
import {
  MetricsQueryDto,
  ResourcesQueryDto,
  LongTasksQueryDto,
  MemoryQueryDto,
  FspQueryDto,
} from '../dtos/performance-query.dto';

@Controller('api/performance')
export class PerformanceMonitorController {
  constructor(
    private readonly performanceMonitorService: PerformanceMonitorService,
  ) {}

  @Get('metrics')
  async getPerformanceMetrics(@Query() query: MetricsQueryDto) {
    return await this.performanceMonitorService.getPerformanceMetrics(query);
  }

  @Get('resources')
  async getResourcesData(@Query() query: ResourcesQueryDto) {
    return await this.performanceMonitorService.getResourcesData(query);
  }

  @Get('long-tasks')
  async getLongTasksData(@Query() query: LongTasksQueryDto) {
    return await this.performanceMonitorService.getLongTasksData(query);
  }

  @Get('memory')
  async getMemoryData(@Query() query: MemoryQueryDto) {
    return await this.performanceMonitorService.getMemoryData(query);
  }

  @Get('fsp')
  async getFspData(@Query() query: FspQueryDto) {
    return await this.performanceMonitorService.getFspData(query);
  }
} 