import {
  SlashCommandBuilder,
  CommandInteraction,
  SlashCommandNumberOption,
  GuildMemberRoleManager,
} from 'discord.js';
import { connectionFactory } from '../../db/connectionFactory';
import { getUnclaimedSlots, updateUsername } from '../../db/queries';
import { updateEmbed } from '../utils/embed';

export default {
  data: new SlashCommandBuilder()
    .setName('claim-slot')
    .setDescription('Select a date to claim.')
    .addNumberOption((option: SlashCommandNumberOption) =>
      option.setName('day').setDescription('The day to claim.').setRequired(true),
    )
    .addUserOption((option) =>
      option.setName('user').setDescription('!Modz only! The user to add.'),
    ),
  async execute(interaction: CommandInteraction) {
    const dateChoice = interaction.options.data[0].value as number;
    const userIdChoice = (interaction.options.data[1]?.value as string) || '';
    const userChoice = interaction.client.users.cache.get(userIdChoice);
    const conn = await connectionFactory();
    const unclaimedSlots = await getUnclaimedSlots(conn);
    const unclaimedNums = unclaimedSlots.map((slot) => slot.date.getDate());
    const date =
      unclaimedSlots.find((s) => s.date.getDate() === dateChoice)?.date || null;
    const dateString = date?.toDateString();
    const roles = interaction.member?.roles as GuildMemberRoleManager;
    // mods or myself or patron can add anyone
    const isMod =
      roles.cache.has('857079472264445953' || '854860807937851452') ||
      interaction.user.id === '577605290241949717' ||
      '776925721388908544';

    const userToAdd = isMod && userChoice ? userChoice : interaction.user;

    const reply = {
      content: `Successfully claimed ${dateString}!`,
      ephemeral: true,
    };
    let success = false;

    if (unclaimedSlots.length === 0) reply.content = 'No slots are available to claim.';
    else if (dateChoice === 69) reply.content = 'Nice.';
    else if (dateChoice === 420) reply.content = 'Blaze it.';
    else if (dateChoice === 666) reply.content = 'Satan.';
    else if (dateChoice < 1 || dateChoice > 31) reply.content = "That ain't a day, bro.";
    else if (!unclaimedNums.includes(dateChoice))
      reply.content = `${dateString || dateChoice} is not available to claim.`;
    else success = true;

    await interaction.reply(reply);
    if (success) {
      await updateUsername(conn, date, userToAdd);
      await updateEmbed(interaction.client);
    }
    await conn.close();

    if (success) console.info(`Claimed ${dateString} by ${userToAdd.username}`);
    else console.info(`${userToAdd.username} failed to claim ${userChoice}`);
  },
};
