import {
  WatchCommandComponents,
  WatchCommandEmbed,
} from "@components/watch/command";
import { CommandInteraction, Client, MessageFlags } from "discord.js";

module.exports = {
  name: "watch",
  description: "[🍿] Assista um filme/série",
  async execute(client: Client, interaction: CommandInteraction) {
    await interaction.reply({
      embeds: await WatchCommandEmbed(),
      components: await WatchCommandComponents(),
      flags: [MessageFlags.Ephemeral],
    });
  },
};
