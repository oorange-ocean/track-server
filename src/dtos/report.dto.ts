import { IsString, IsNumber, IsOptional, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class DeviceInfoDto {
  @IsString()
  browserVersion: string;

  @IsString()
  browser: string;

  @IsString()
  osVersion: string;

  @IsString()
  os: string;

  @IsString()
  ua: string;

  @IsString()
  device: string;

  @IsString()
  device_type: string;
}

export class BaseReportDto {
  @IsString()
  type: string;

  @IsString()
  pageUrl: string;

  @IsNumber()
  time: number;

  @IsString()
  uuid: string;

  @IsString()
  apikey: string;

  @IsString()
  status: string;

  @IsString()
  sdkVersion: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  deviceInfo: DeviceInfoDto;
} 