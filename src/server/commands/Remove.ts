import {
  SlashCommandBuilder,
  CommandInteraction,
  SlashCommandNumberOption,
  GuildMemberRoleManager,
} from 'discord.js';
import { connectionFactory } from '../../db/connectionFactory';
import { getClaimedSlots, updateUsername } from '../../db/queries';
import { updateEmbed } from '../embed';

export default {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Select a date to remove your name from.')
    .addNumberOption((option: SlashCommandNumberOption) =>
      option.setName('day').setDescription('The day number to remove.'),
    ),
  async execute(interaction: CommandInteraction) {
    const choice = interaction.options.data[0].value as number;
    const conn = await connectionFactory();
    const claimedSlots = await getClaimedSlots(conn);
    const claimedNums = claimedSlots.map((slot) => slot.date.getDate());
    const date = claimedSlots.find((s) => s.date.getDate() === choice)?.date || null;
    const dateString = date?.toDateString();
    const isUserOnDate =
      claimedSlots.find((s) => s.date.getDate() === choice)?.userId ===
      interaction.user.id;
    const roles = interaction.member?.roles as GuildMemberRoleManager;
    const isMod = roles.cache.some(
      (r) => r.name === 'Modz' || r.name === 'Original Degenz',
    );

    const reply = {
      content: `Successfully removed your name from ${dateString}!`,
      ephemeral: true,
    };
    let success = false;

    if (claimedSlots.length === 0) reply.content = 'No slots have been claimed.';
    else if (choice === 69) reply.content = 'Nice.';
    else if (choice === 420) reply.content = 'Blaze it.';
    else if (choice === 666) reply.content = 'Satan.';
    else if (choice < 1 || choice > 31) reply.content = "That ain't a day, bro.";
    else if (!claimedNums.includes(choice))
      reply.content = `${dateString || choice} has not been claimed.`;
    else if (isUserOnDate || isMod) success = true;

    await interaction.reply(reply);
    if (success) {
      await updateUsername(conn, date);
      await updateEmbed(interaction.client);
    }
    await conn.close();
  },
};
