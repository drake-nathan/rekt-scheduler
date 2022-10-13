import { Schema } from 'mongoose';
import { Slot } from './types';

export const slotSchema = new Schema<Slot>({
  date: { type: Date, required: true },
  username: { type: String },
});
