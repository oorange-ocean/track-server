import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ReportService } from '../services/report.service';
import { ErrorReportDto } from '../dtos/error-report.dto';
import { PerformanceReportDto } from '../dtos/performance-report.dto';
import { RecordScreenDto } from '../dtos/record-screen.dto';
import { WhiteScreenDto } from '../dtos/white-screen.dto';

@Controller('reportData')
export class ReportController {
  private readonly logger = new Logger(ReportController.name);

  constructor(private readonly reportService: ReportService) {}

  @Post()
  async handleReport(@Body() data: any) {
    this.logger.log(`收到上报数据`, data);

    switch (data.type) {
      case 'error':
      case 'unhandledrejection':
        return await this.reportService.handleErrorReport(data as ErrorReportDto);
      case 'performance':
        return await this.reportService.handlePerformanceReport(data as PerformanceReportDto);
      case 'recordScreen':
        return await this.reportService.handleRecordScreen(data as RecordScreenDto);
      case 'whiteScreen':
        return await this.reportService.handleWhiteScreen(data as WhiteScreenDto);
      default:
        return {
          code: 400,
          message: `不支持的上报类型: ${data.type}`,
        };
    }
  }
} 