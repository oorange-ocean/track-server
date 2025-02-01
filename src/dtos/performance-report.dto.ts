import { IsString, IsNumber } from 'class-validator';
import { BaseReportDto } from './report.dto';

export class PerformanceReportDto extends BaseReportDto {
  @IsString()
  name: string;

  @IsNumber()
  value: number;

  @IsString()
  rating: string;
} 