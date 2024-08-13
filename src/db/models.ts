import mongoose, { Schema } from 'mongoose';

const timeSlotSchema: Schema = new Schema({
  time: { type: String, required: true },
  status: {
    type: String,
    enum: ['notReady', 'ready', 'uncertain'],
    required: true,
  },
});

const personSchema: Schema = new Schema({
  name: { type: String, required: true },
  timeSlot: [timeSlotSchema],
});

export default mongoose.models.Person ||
  mongoose.model('Person', personSchema, 'persons');
