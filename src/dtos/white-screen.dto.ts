import { IsString, IsEnum } from 'class-validator';
import { BaseReportDto } from './report.dto';

export class WhiteScreenDto extends BaseReportDto {
  @IsEnum(['error', 'ok'])
  status: 'error' | 'ok';
} 