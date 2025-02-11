import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from '../schemas/report.schema';
import {
  MetricsQueryDto,
  ResourcesQueryDto,
  LongTasksQueryDto,
  MemoryQueryDto,
  FspQueryDto,
  WhiteScreenQueryDto,
} from '../dtos/performance-query.dto';

@Injectable()
export class PerformanceMonitorService {
  private readonly logger = new Logger(PerformanceMonitorService.name);

  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
  ) {}

  async getPerformanceMetrics(query: MetricsQueryDto) {
    const { startTime, endTime, apikey, name, rating, page, pageSize } = query;
    
    // 先只用 apikey 查询，看看数据的具体内容
    try {
      const sampleData = await this.reportModel
        .find({ apikey })
        .limit(1)
        .exec();
      this.logger.debug('样本数据:', JSON.stringify(sampleData, null, 2));

      // 逐步添加条件查询
      const results = await Promise.all([
        this.reportModel.countDocuments({ apikey }),
        this.reportModel.countDocuments({ apikey, type: 'performance' }),
        this.reportModel.countDocuments({ apikey, type: 'performance', name }),
        this.reportModel.countDocuments({ apikey, type: 'performance', name, rating })
      ]);
      
      this.logger.debug('逐步查询结果:', {
        'apikey only': results[0],
        'with type': results[1],
        'with name': results[2],
        'with rating': results[3]
      });

      // 原有的查询逻辑
      const filter: any = {
        apikey,
        type: 'performance',
      };

      if (name) filter['name'] = name;
      if (rating) filter['rating'] = rating;

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
        data: { total, list },
      };
    } catch (error) {
      this.logger.error('获取性能指标失败', error);
      return {
        code: 500,
        message: '获取性能指标失败',
      };
    }
  }

  async getResourcesData(query: ResourcesQueryDto) {
    const { startTime, endTime, apikey, initiatorType, page, pageSize } = query;
    const filter: any = {
      apikey,
      type: 'resource',
      time: { $gte: startTime, $lte: endTime },
    };

    if (initiatorType) filter['initiatorType'] = initiatorType;

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
        data: { total, list },
      };
    } catch (error) {
      this.logger.error('获取资源加载数据失败', error);
      return {
        code: 500,
        message: '获取资源加载数据失败',
      };
    }
  }

  async getLongTasksData(query: LongTasksQueryDto) {
    const { startTime, endTime, apikey, page, pageSize } = query;
    const filter: any = {
      apikey,
      type: 'longTask',
      time: { $gte: startTime, $lte: endTime },
    };

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
        data: { total, list },
      };
    } catch (error) {
      this.logger.error('获取长任务数据失败', error);
      return {
        code: 500,
        message: '获取长任务数据失败',
      };
    }
  }

  async getMemoryData(query: MemoryQueryDto) {
    const { startTime, endTime, apikey, page, pageSize } = query;
    const filter: any = {
      apikey,
      type: 'memory',
      time: { $gte: startTime, $lte: endTime },
    };

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
        data: { total, list },
      };
    } catch (error) {
      this.logger.error('获取内存使用数据失败', error);
      return {
        code: 500,
        message: '获取内存使用数据失败',
      };
    }
  }

  async getFspData(query: FspQueryDto) {
    const { startTime, endTime, apikey, rating, page, pageSize } = query;
    const filter: any = {
      apikey,
      type: 'fsp',
      time: { $gte: startTime, $lte: endTime },
    };

    if (rating) filter['rating'] = rating;

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
        data: { total, list },
      };
    } catch (error) {
      this.logger.error('获取首屏加载数据失败', error);
      return {
        code: 500,
        message: '获取首屏加载数据失败',
      };
    }
  }

  async getWhiteScreenData(query: WhiteScreenQueryDto) {
    const { startTime, endTime, apikey, status, page = 1, pageSize = 20 } = query;
    
    const filter: any = {
      apikey,
      type: 'whiteScreen',
      time: { $gte: startTime, $lte: endTime },
    };

    if (status) {
      filter.status = status;
    }

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
        data: { total, list },
      };
    } catch (error) {
      this.logger.error('获取白屏检测数据失败', error);
      return {
        code: 500,
        message: '获取白屏检测数据失败',
      };
    }
  }
} 