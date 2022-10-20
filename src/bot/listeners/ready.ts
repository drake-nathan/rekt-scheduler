import { Client } from 'discord.js';
import { CronJob } from 'cron';

export const ready = async (
  client: Client,
  updateEmbed: (client: Client) => Promise<void>,
) => {
  const updateEmbedCron = new CronJob('0 0 * * *', async () => {
    try {
      await updateEmbed(client);
    } catch (error) {
      console.error(error);
    }
  });

  client.once('ready', async () => {
    console.info('Bot online!');

    try {
      await updateEmbed(client);
    } catch (error) {
      console.error(error);
    }

    updateEmbedCron.start();
  });
};
