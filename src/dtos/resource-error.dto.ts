import { IsString, IsNumber } from 'class-validator';
import { BaseReportDto } from './report.dto';

export class ResourceErrorDto extends BaseReportDto {
  @IsNumber()
  time: number;

  @IsString()
  message: string;

  @IsString()
  name: string;  // 资源类型(js/css等)
} 