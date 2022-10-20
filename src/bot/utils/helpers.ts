import { Client, Message, TextChannel } from 'discord.js';
import * as dotenv from 'dotenv';
import { connectionFactory } from '../../db/connectionFactory';
import { getSlot } from '../../db/queries';

dotenv.config();

export const sendReminder = async (client: Client, prevMsg?: Message) => {
  const conn = await connectionFactory();
  const channelId = process.env.CHANNEL_ID;
  const channel = (await client.channels.fetch(channelId)) as TextChannel;
  const today = new Date();
  const slot = await getSlot(conn, today);

  let msg: Message;

  if (slot && slot.username) {
    msg = await channel.send(
      `<@${
        slot.userId
      }> Reminder: You're on rekt commentary today, ${today.toLocaleDateString()}!`,
    );
  } else {
    msg = await channel.send(
      `<@776925721388908544> There's no one on rekt commentary today, ${today.toLocaleDateString()}!`,
    );
  }

  return msg;
};

export const clearChannel = async (client: Client) => {};
