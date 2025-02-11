import { Controller, Get, Query, Param } from '@nestjs/common';
import { ErrorMonitorService } from '../services/error-monitor.service';
import { ErrorListQueryDto, ErrorStatsQueryDto } from '../dtos/error-query.dto';

@Controller('api/errors')
export class ErrorMonitorController {
  constructor(private readonly errorMonitorService: ErrorMonitorService) {}

  @Get('list')
  async getErrorList(@Query() query: ErrorListQueryDto) {
    return await this.errorMonitorService.getErrorList(query);
  }

  @Get('stats')
  async getErrorStats(@Query() query: ErrorStatsQueryDto) {
    return await this.errorMonitorService.getErrorStats(query);
  }

  @Get(':id')
  async getErrorDetail(@Param('id') id: string, @Query('apikey') apikey: string) {
    return await this.errorMonitorService.getErrorDetail(id, apikey);
  }
} 