import mongoose, { Schema, Document, Model } from 'mongoose';

export type Status = 'notReady' | 'ready' | 'uncertain';

type TimeSlot = {
  time: string;
  status: Status;
};

export type PersonData = { name: string; timeSlot: TimeSlot[] };

export interface PersonDocument extends Document {
  name: string;
  timeSlot: TimeSlot[];
}

const TimeSlotSchema: Schema = new Schema({
  time: { type: String, required: true },
  status: {
    type: String,
    enum: ['notReady', 'ready', 'uncertain'],
    required: true,
  },
});

const PersonSchema: Schema = new Schema({
  name: { type: String, required: true },
  timeSlot: [TimeSlotSchema],
});

export const Person: Model<PersonDocument> =
  mongoose.models.Person ||
  mongoose.model<PersonDocument>('Person', PersonSchema);
