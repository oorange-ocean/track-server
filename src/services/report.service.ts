import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from '../schemas/report.schema';
import { ErrorReportDto } from '../dtos/error-report.dto';
import { PerformanceReportDto } from '../dtos/performance-report.dto';
import { RecordScreenDto } from '../dtos/record-screen.dto';
import { WhiteScreenDto } from '../dtos/white-screen.dto';
import { ResourceErrorDto } from '../dtos/resource-error.dto';
import { HttpErrorDto } from '../dtos/http-error.dto';

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
      return { code: 0, message: '错误上报成功' };
    } catch (error) {
      this.logger.error('保存错误数据失败', error);
      throw error;
    }
  }

  async handlePerformanceReport(data: PerformanceReportDto) {
    try {
      this.logger.debug('收到性能数据:', {
        time: data.time,
        type: data.type,
        name: data.name,
        rating: data.rating,
        value: data.value,
        fullData: JSON.stringify(data, null, 2)
      });
      
      // 将性能指标数据拆分为多条记录保存
      if (data.metrics && Array.isArray(data.metrics)) {
        const reports = data.metrics.map(metric => {
          return new this.reportModel({
            ...data,
            type: 'performance',
            name: metric.name,
            value: metric.value,
            rating: metric.rating
          });
        });
        
        await Promise.all(reports.map(report => report.save()));
        this.logger.debug(`保存了 ${reports.length} 条性能指标数据`);
      } else {
        // 处理单条性能指标数据
        const report = new this.reportModel({
          ...data,
          type: 'performance',
          name: data.name,
          value: data.value,
          rating: data.rating
        });
        await report.save();
        this.logger.debug('保存了1条性能指标数据');
      }
      
      return { code: 0, message: '性能数据上报成功' };
    } catch (error) {
      this.logger.error('保存性能数据失败', error);
      throw error;
    }
  }

  async handleRecordScreen(data: RecordScreenDto) {
    try {
      const report = new this.reportModel(data);
      await report.save();
      return { code: 0, message: '录屏数据上报成功' };
    } catch (error) {
      this.logger.error('保存录屏数据失败', error);
      throw error;
    }
  }

  async handleWhiteScreen(data: WhiteScreenDto) {
    try {
      const report = new this.reportModel(data);
      await report.save();
      return { code: 0, message: '白屏检测数据上报成功' };
    } catch (error) {
      this.logger.error('保存白屏检测数据失败', error);
      throw error;
    }
  }

  async handleResourceError(data: ResourceErrorDto) {
    try {
      const report = new this.reportModel(data);
      await report.save();
      return { code: 0, message: '资源错误上报成功' };
    } catch (error) {
      this.logger.error('保存资源错误数据失败', error);
      throw error;
    }
  }

  async handleHttpError(data: HttpErrorDto) {
    try {
      const report = new this.reportModel(data);
      await report.save();
      return { code: 0, message: '接口请求错误上报成功' };
    } catch (error) {
      this.logger.error('保存接口请求错误数据失败', error);
      throw error;
    }
  }
} 