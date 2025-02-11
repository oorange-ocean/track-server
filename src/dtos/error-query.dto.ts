import { IsNumber, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class ErrorListQueryDto {
  @IsNumber()
  @Transform(({ value }) => {
    const num = Number(value);
    return num > 1e12 ? Math.floor(num / 1000) : num;
  })
  startTime: number;

  @IsNumber()
  @Transform(({ value }) => {
    const num = Number(value);
    return num > 1e12 ? Math.floor(num / 1000) : num;
  })
  endTime: number;

  @IsString()
  apikey: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  device_type?: string;

  @IsOptional()
  @IsString()
  browser?: string;

  @IsOptional()
  @IsString()
  os?: string;

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  pageSize?: number = 20;
}

export class ErrorStatsQueryDto {
  @IsNumber()
  @Transform(({ value }) => {
    const num = Number(value);
    return num > 1e12 ? Math.floor(num / 1000) : num;
  })
  startTime: number;

  @IsNumber()
  @Transform(({ value }) => {
    const num = Number(value);
    return num > 1e12 ? Math.floor(num / 1000) : num;
  })
  endTime: number;

  @IsString()
  apikey: string;
} 