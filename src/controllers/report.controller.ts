import { Controller, Post, Body, Logger, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { ReportService } from '../services/report.service';
import { ErrorReportDto } from '../dtos/error-report.dto';
import { PerformanceReportDto } from '../dtos/performance-report.dto';
import { RecordScreenDto } from '../dtos/record-screen.dto';
import { WhiteScreenDto } from '../dtos/white-screen.dto';
import { ResourceErrorDto } from '../dtos/resource-error.dto';
import { HttpErrorDto } from '../dtos/http-error.dto';
import { Request } from 'express';

@Controller('reportData')
export class ReportController {
  private readonly logger = new Logger(ReportController.name);

  constructor(private readonly reportService: ReportService) {}

  @Post()
  async handleReport(@Req() request: RawBodyRequest<Request>) {
    let data: any;
    
    try {
      // 如果是文本格式，手动解析JSON
      if (request.headers['content-type']?.includes('text/plain')) {
        data = JSON.parse(request.body as string);
      } else {
        data = request.body;
      }
      
      this.logger.log(`收到上报数据:`, data);

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
        case 'resource':
          return await this.reportService.handleResourceError(data as ResourceErrorDto);
        case 'xhr':
        case 'fetch':
          return await this.reportService.handleHttpError(data as HttpErrorDto);
        default:
          return {
            code: 400,
            message: `不支持的上报类型: ${data.type}`,
          };
      }
    } catch (error) {
      this.logger.error('处理上报数据失败:', error);
      return {
        code: 500,
        message: '处理上报数据失败',
      };
    }
  }
} 