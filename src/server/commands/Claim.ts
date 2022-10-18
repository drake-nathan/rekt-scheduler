import {
  SlashCommandBuilder,
  CommandInteraction,
  SlashCommandNumberOption,
} from 'discord.js';
import { connectionFactory } from '../../db/connectionFactory';
import { getUnclaimedSlots, updateUsername } from '../../db/queries';
import { updateEmbed } from '../embed';

export default {
  data: new SlashCommandBuilder()
    .setName('claim')
    .setDescription('Select a date to claim.')
    .addNumberOption((option: SlashCommandNumberOption) =>
      option.setName('day').setDescription('The day to claim.'),
    ),
  async execute(interaction: CommandInteraction) {
    const choice = interaction.options.data[0].value as number;
    const conn = await connectionFactory();
    const unclaimedSlots = await getUnclaimedSlots(conn);
    const unclaimedNums = unclaimedSlots.map((slot) => slot.date.getDate());
    const date = unclaimedSlots.find((s) => s.date.getDate() === choice)?.date || null;
    const dateString = date?.toDateString();

    const reply = {
      content: `Successfully claimed ${dateString}!`,
      ephemeral: true,
    };
    let success = false;

    if (unclaimedSlots.length === 0) reply.content = 'No slots are available to claim.';
    else if (choice === 69) reply.content = 'Nice.';
    else if (choice === 420) reply.content = 'Blaze it.';
    else if (choice === 666) reply.content = 'Satan.';
    else if (choice < 1 || choice > 31) reply.content = "That ain't a day, bro.";
    else if (!unclaimedNums.includes(choice))
      reply.content = `${dateString || choice} is not available to claim.`;
    else success = true;

    await interaction.reply(reply);
    if (success) {
      await updateUsername(conn, date, interaction.user);
      await updateEmbed(interaction.client);
    }
    await conn.close();
  },
};
