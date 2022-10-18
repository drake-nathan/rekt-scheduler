import { Client, Collection, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import commands from './server/commands';
import { interactionCreate, ready } from './server/listeners';
import { deployCommands } from './server/deployCommands';
import { updateEmbed } from './server/embed';

dotenv.config();
const token = process.env.TOKEN;

if (!token) {
  throw new Error('No discord token found!');
}

const client: Client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

commands.forEach((command) => {
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.error(
      `[WARNING] ${
        command.data.name || 'A command'
      } is missing a required "data" or "execute" property.`,
    );
  }
});

deployCommands();

ready(client, updateEmbed);
interactionCreate(client);

client.login(token);

client.on('error', (e) => console.error(e));
client.on('warn', (e) => console.warn(e));
client.on('debug', (e) => console.info(e));
