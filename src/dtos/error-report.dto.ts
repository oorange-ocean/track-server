import { IsString, IsNumber } from 'class-validator';
import { BaseReportDto } from './report.dto';

export class ErrorReportDto extends BaseReportDto {
  @IsString()
  message: string;

  @IsString()
  fileName: string;

  @IsNumber()
  line: number;

  @IsNumber()
  column: number;
} 