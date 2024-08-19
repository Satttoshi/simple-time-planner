import mongoose, { Schema } from 'mongoose';

const timeSlotSchema: Schema = new Schema(
  {
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ['init', 'notReady', 'ready', 'uncertain'],
      required: true,
    },
  },
  { _id: false },
);

const personSchema: Schema = new Schema({
  name: { type: String, required: true },
  timeSlot: [timeSlotSchema],
});

const daySchema: Schema = new Schema({
  date: { type: String, required: true },
  persons: [personSchema],
});

const weekSchema: Schema = new Schema({
  week: { type: Number, required: true },
  days: [daySchema],
});

export const Week =
  mongoose.models.Week || mongoose.model('Weeks', weekSchema, 'weeks');
