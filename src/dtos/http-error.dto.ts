import { IsString, IsNumber, IsObject, IsIn } from 'class-validator';
import { BaseReportDto } from './report.dto';

export class HttpRequestDataDto {
  @IsIn(['xhr', 'fetch'])
  httpType: 'xhr' | 'fetch';

  @IsString()
  method: string;

  data: any;
}

export class HttpResponseDataDto {
  @IsNumber()
  Status: number;

  data: any;
}

export class HttpErrorDto extends BaseReportDto {
  @IsIn(['xhr', 'fetch'])
  type: 'xhr' | 'fetch';

  @IsString()
  url: string;

  @IsNumber()
  elapsedTime: number;

  @IsString()
  message: string;

  @IsObject()
  requestData: HttpRequestDataDto;

  @IsObject()
  response: HttpResponseDataDto;
} 