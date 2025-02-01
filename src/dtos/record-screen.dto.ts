import { IsString } from 'class-validator';
import { BaseReportDto } from './report.dto';

export class RecordScreenDto extends BaseReportDto {
  @IsString()
  recordScreenId: string;

  @IsString()
  events: string;
} 