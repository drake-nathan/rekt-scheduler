import { Client } from 'discord.js';

export const ready = async (
  client: Client,
  updateEmbed: (client: Client) => Promise<void>,
) => {
  client.once('ready', async () => {
    console.info('Bot online!');

    try {
      await updateEmbed(client);
    } catch (error) {
      console.error(error);
    }
  });
};
