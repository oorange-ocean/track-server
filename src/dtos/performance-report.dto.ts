import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseReportDto } from './report.dto';

class MetricDto {
  @IsString()
  name: string;

  @IsNumber()
  value: number;

  @IsString()
  rating: string;
}

export class PerformanceReportDto extends BaseReportDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetricDto)
  metrics?: MetricDto[];

  @IsString()
  name: string;

  @IsNumber()
  value: number;

  @IsString()
  rating: string;
} 