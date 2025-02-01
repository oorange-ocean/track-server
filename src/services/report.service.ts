import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from '../schemas/report.schema';
import { ErrorReportDto } from '../dtos/error-report.dto';
import { PerformanceReportDto } from '../dtos/performance-report.dto';
import { RecordScreenDto } from '../dtos/record-screen.dto';
import { WhiteScreenDto } from '../dtos/white-screen.dto';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
  ) {}

  async handleErrorReport(data: ErrorReportDto) {
    try {
      const report = new this.reportModel(data);
      await report.save();
      return { code: 200, message: '错误上报成功' };
    } catch (error) {
      this.logger.error('保存错误数据失败', error);
      throw error;
    }
  }

  async handlePerformanceReport(data: PerformanceReportDto) {
    try {
      const report = new this.reportModel(data);
      await report.save();
      return { code: 200, message: '性能数据上报成功' };
    } catch (error) {
      this.logger.error('保存性能数据失败', error);
      throw error;
    }
  }

  async handleRecordScreen(data: RecordScreenDto) {
    try {
      const report = new this.reportModel(data);
      await report.save();
      return { code: 200, message: '录屏数据上报成功' };
    } catch (error) {
      this.logger.error('保存录屏数据失败', error);
      throw error;
    }
  }

  async handleWhiteScreen(data: WhiteScreenDto) {
    try {
      const report = new this.reportModel(data);
      await report.save();
      return { code: 200, message: '白屏检测数据上报成功' };
    } catch (error) {
      this.logger.error('保存白屏检测数据失败', error);
      throw error;
    }
  }
} 