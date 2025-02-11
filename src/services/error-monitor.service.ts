import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from '../schemas/report.schema';
import { ErrorListQueryDto, ErrorStatsQueryDto } from '../dtos/error-query.dto';

@Injectable()
export class ErrorMonitorService {
  private readonly logger = new Logger(ErrorMonitorService.name);

  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
  ) {}

  async getErrorList(query: ErrorListQueryDto) {
    const {
      startTime,
      endTime,
      apikey,
      type,
      status,
      device_type,
      browser,
      os,
      page,
      pageSize,
    } = query;

    const filter: any = {
      apikey,
      time: {
        $gte: startTime,
        $lte: endTime,
      },
    };

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (device_type) filter['deviceInfo.device_type'] = device_type;
    if (browser) filter['deviceInfo.browser'] = browser;
    if (os) filter['deviceInfo.os'] = os;

    try {
      const skip = (page - 1) * pageSize;
      const [total, list] = await Promise.all([
        this.reportModel.countDocuments(filter),
        this.reportModel
          .find(filter)
          .sort({ time: -1 })
          .skip(skip)
          .limit(pageSize)
          .exec(),
      ]);

      return {
        code: 0,
        data: {
          total,
          list,
          page,
          pageSize,
        },
      };
    } catch (error) {
      this.logger.error('获取错误列表失败', error);
      return {
        code: 500,
        message: '获取错误列表失败',
      };
    }
  }

  async getErrorStats(query: ErrorStatsQueryDto) {
    const { startTime, endTime, apikey } = query;
    const matchStage = {
      apikey,
      time: { $gte: startTime, $lte: endTime },
      type: { $in: ['error', 'resource', 'xhr', 'fetch'] },
    };

    const [
      total,
      typeStats,
      browserStats,
      osStats,
      urlStats,
    ] = await Promise.all([
      this.reportModel.countDocuments(matchStage),
      this.reportModel.aggregate([
        { $match: matchStage },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $project: { type: '$_id', count: 1, _id: 0 } },
      ]),
      this.reportModel.aggregate([
        { $match: matchStage },
        { $group: { _id: '$deviceInfo.browser', count: { $sum: 1 } } },
        { $project: { browser: '$_id', count: 1, _id: 0 } },
      ]),
      this.reportModel.aggregate([
        { $match: matchStage },
        { $group: { _id: '$deviceInfo.os', count: { $sum: 1 } } },
        { $project: { os: '$_id', count: 1, _id: 0 } },
      ]),
      this.reportModel.aggregate([
        { $match: matchStage },
        { $group: { _id: '$pageUrl', count: { $sum: 1 } } },
        { $project: { pageUrl: '$_id', count: 1, _id: 0 } },
      ]),
    ]);

    return {
      code: 0,
      data: {
        total,
        typeStats,
        browserStats,
        osStats,
        urlStats,
      },
    };
  }

  async getErrorDetail(id: string, apikey: string) {
    this.logger.log('获取错误详情', id, apikey);
    const error = await this.reportModel.findOne({
      _id: id,
      apikey,
    });

    if (!error) {
      return {
        code: 404,
        message: '错误记录不存在',
      };
    }

    return {
      code: 0,
      data: error,
    };
  }
} 