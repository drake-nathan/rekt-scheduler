import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { connectionFactory } from '../../db/connectionFactory';
import { get14Slots, getUnclaimedSlots } from '../../db/queries';
import { Slot } from '../../db/types';

export const getEmbed = async () => {
  console.info('Updating embed...');

  let slots: Slot[];

  try {
    const conn = await connectionFactory();
    slots = await get14Slots(conn);

    const availableSlots = await getUnclaimedSlots(conn);
    console.info(availableSlots);

    await conn.close();
  } catch (error) {
    console.error(error);
    return;
  }

  let message: string = '';

  slots.forEach((slot) => {
    const userStr = slot.userId ? `${slot.username}` : '';
    message += `${slot.date.toDateString().slice(0, -5)}: ${userStr}\n`;
  });

  message += '\n**Instructions:**';
  message += "\nTo claim a slot: **'/claim-slot'.**";
  message += "\nThen enter the date number: '17' for the 17th.";
  message += '\nMods can optionally specify a username to add.';
  message += "\nUse **'/clear-slot'** to remove yourself from a slot.\n";
  message += '\n**Note: Please do not send messages in this channel.**';

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
  const lastMsg = messages.filter((m) => m.author.id === client.user?.id).first();

  if (lastMsg) {
    await lastMsg.edit({ embeds: [embed] });
  } else {
    await channel.send({ embeds: [embed] });
  }

  console.info(`Updated embed at ${new Date()}`);
};
