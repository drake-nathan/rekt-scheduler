import { REST, Routes } from 'discord.js';
import * as dotenv from 'dotenv';
import commands from './commands';

dotenv.config();
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token) {
  throw new Error('No discord token found!');
}

export const deployCommands = async () => {
  const rest = new REST({ version: '10' }).setToken(token);

  const parsedCommands = commands.map((command) => command.data.toJSON());

  try {
    console.info('Clearing (/) commands.');

    await rest
      .get(Routes.applicationGuildCommands(clientId, guildId))
      .then((data: any[]) =>
        Promise.all(
          data.map((command) =>
            rest.delete(
              `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`,
            ),
          ),
        ),
      );

    console.info(`Started refreshing ${commands.length} application (/) commands.`);

    const data: any[] = (await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      {
        body: parsedCommands,
      },
    )) as any[];

    console.info(`Successfully reloaded ${data?.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
};
