/* eslint-disable no-await-in-loop */
import { Connection } from 'mongoose';
import { Slot } from './types';

export const getSlot = (conn: Connection, date: Date) => {
  const SlotSchema = conn.model<Slot>('Slot');

  const [year, month, day] = [date.getFullYear(), date.getMonth(), date.getDate()];
  const searchDate = new Date(year, month, day);

  return SlotSchema.findOne({ date: searchDate }).exec();
};

export const addSlots = (conn: Connection, slot: Slot[]) => {
  const SlotSchema = conn.model<Slot>('Slot');

  return SlotSchema.create(slot);
};

export const get14Slots = async (conn: Connection) => {
  const SlotSchema = conn.model<Slot>('Slot');

  const today = new Date();

  const slots: Slot[] = [];
  let newSlotsCount: number = 0;

  for (let i = 0; i < 14; i += 1) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);

    let slot = await SlotSchema.findOne({ date }).exec();

    if (!slot) {
      const newSlot = new SlotSchema({ date });
      await addSlots(conn, [newSlot]);
      slot = newSlot;
      newSlotsCount += 1;
    }

    slots.push(slot);
  }

  console.info(`Added ${newSlotsCount} new slots`);
  return slots;
};

export const getUnclaimedSlots = (conn: Connection) => {
  const SlotSchema = conn.model<Slot>('Slot');

  return SlotSchema.find({ username: null }).exec();
};

export const getClaimedSlots = (conn: Connection) => {
  const SlotSchema = conn.model<Slot>('Slot');

  return SlotSchema.find({ username: { $ne: null } }).exec();
};

export const updateUsername = (conn: Connection, date: Date, username?: string) => {
  const SlotSchema = conn.model<Slot>('Slot');

  const [year, month, day] = [date.getFullYear(), date.getMonth(), date.getDate()];
  const searchDate = new Date(year, month, day);

  const query = SlotSchema.findOneAndUpdate(
    { date: searchDate },
    { username: username || null },
    { new: true },
  ).exec();

  return query;
};
