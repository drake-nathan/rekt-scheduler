import { Client } from 'discord.js';

export const ready = async (
  client: Client,
  updateEmbed: (client: Client) => Promise<void>,
) => {
  client.once('ready', async () => {
    console.info('Bot online!');
    client.guilds.cache.forEach(async (guild) => {
      const rektRole = guild.roles.cache.get('1032324867833475136');
      console.info(rektRole.permissions);
    });
    try {
      await updateEmbed(client);
    } catch (error) {
      console.error(error);
    }
  });
};
