import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// 设备信息 Schema
@Schema()
export class DeviceInfo {
  @Prop()
  browserVersion: string;

  @Prop()
  browser: string;

  @Prop()
  osVersion: string;

  @Prop()
  os: string;

  @Prop()
  ua: string;

  @Prop()
  device: string;

  @Prop()
  device_type: string;
}

// 基础报告 Schema
@Schema()
export class Report extends Document {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  pageUrl: string;

  @Prop({ required: true })
  time: number;

  @Prop({ required: true })
  uuid: string;

  @Prop({ required: true })
  apikey: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  sdkVersion: string;

  @Prop()
  userId?: string;

  @Prop({ type: DeviceInfo })
  deviceInfo: DeviceInfo;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  name?: string;  // 性能指标名称，如 FCP, LCP 等

  @Prop()
  value?: number;  // 性能指标值

  @Prop()
  rating?: string;  // 性能评级：good, needs-improvement, poor
}

export const ReportSchema = SchemaFactory.createForClass(Report); 