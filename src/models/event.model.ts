import { Schema, model } from 'mongoose';

const EventSchema = new Schema({
  eventName: { type: String, required: true },
  projectId: { type: String, required: true },
  params: { type: Schema.Types.Mixed },
  userInfo: {
    browser: String,
    os: String,
    uid: String
  },
  timestamp: { type: Date, default: Date.now }
});

export const Event = model('Event', EventSchema); 