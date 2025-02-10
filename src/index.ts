import { GatewayIntentBits } from "discord.js";
import { join } from "path";
import dotenv from "dotenv";
import { CustomClient } from "./types/client";
import { loadCommands, loadEvents, registerCommands } from "./handler/index";
import { mongoConnect } from "./database/index";

dotenv.config();
mongoConnect();

const client = new CustomClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
  ],
  partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION"],
});

const commandsPath = join(__dirname, "commands");
const eventsPath = join(__dirname, "events");

loadCommands(client, commandsPath);
loadEvents(client, eventsPath);

client.once("ready", async () => {
  await registerCommands(client);
});

client.login(process.env.DISCORD_TOKEN);
