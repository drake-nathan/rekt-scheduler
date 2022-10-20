import { Client, EmbedBuilder, TextChannel } from 'discord.js';
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
    const userStr = slot.userId ? `<@${slot.userId}>` : '';
    message += `${slot.date.toDateString().slice(0, -5)}: ${userStr}\n`;
  });

  message += '\nInstructions:';
  message += "\nTo claim a slot: '/claim-slot'.";
  message += "\nThen enter the date number: '17' for the 17th.";
  message += '\nMods can optionally specify a username to add.';
  message += "\nUse '/clear-slot' to remove yourself from a slot.";

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

export const updateEmbed = async (client: Client) => {
  const channelId = process.env.CHANNEL_ID;
  const channel = (await client.channels.fetch(channelId)) as TextChannel;

  const embed = await getEmbed();

  const messages = await channel.messages.fetch();
  const lastMsg = messages.filter((m) => m.author.id === client.user?.id).last();

  if (lastMsg) {
    await lastMsg.edit({ embeds: [embed] });
  } else {
    await channel.send({ embeds: [embed] });
  }

  console.info(`Updated embed at ${new Date()}`);
};
