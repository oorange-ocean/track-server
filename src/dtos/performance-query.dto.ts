import { IsNumber, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class BasePerformanceQueryDto {
  @IsNumber()
  @Transform(({ value }) => {
    const num = Number(value);
     return num > 1e12 ? Math.floor(num / 1000) : (num < 1e10 ? num * 1000 : num);
  })
  startTime: number;

  @IsNumber()
  @Transform(({ value }) => {
    const num = Number(value);
    return num > 1e12 ? Math.floor(num / 1000) : (num < 1e10 ? num * 1000 : num);
  })
  endTime: number;

  @IsString()
  apikey: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  pageSize?: number = 20;
}

export class MetricsQueryDto extends BasePerformanceQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  rating?: string;
}

export class ResourcesQueryDto extends BasePerformanceQueryDto {
  @IsOptional()
  @IsString()
  initiatorType?: string;
}

export class LongTasksQueryDto extends BasePerformanceQueryDto {}

export class MemoryQueryDto extends BasePerformanceQueryDto {}

export class FspQueryDto extends BasePerformanceQueryDto {
  @IsOptional()
  @IsString()
  rating?: string;
}

export class WhiteScreenQueryDto extends BasePerformanceQueryDto {
  @IsOptional()
  @IsString()
  status?: 'error' | 'ok';
} 