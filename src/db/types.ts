import { ObjectId } from 'mongoose';

export interface Slot {
  _id?: ObjectId;
  date: Date;
  username?: string;
  userId?: string;
}
