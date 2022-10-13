import { EmbedBuilder } from 'discord.js';
import { connectionFactory } from '../db/connectionFactory';
import { get14Slots } from '../db/queries';
import { Slot } from '../db/types';

export const getEmbed = async () => {
  console.info('Updating embed...');

  let slots: Slot[];

  try {
    const conn = await connectionFactory();
    slots = await get14Slots(conn);
    await conn.close();
  } catch (error) {
    console.error(error);
    return;
  }

  let message: string = '';

  slots.forEach((slot) => {
    message += `${slot.date.toDateString()}: ${slot.username || ''}\n`;
  });

  const embed = new EmbedBuilder()
    .setTitle('Rekt Commentary Schedule')
    .setThumbnail(
      'https://i.seadn.io/gcs/files/0d5f1b200a067938f507cbe12bbbabc2.jpg?auto=format',
    )
    .setFooter({ text: 'Last updated:' })
    .setTimestamp()
    .setDescription(message)
    .setColor('#e3e360');

  return embed;
};
