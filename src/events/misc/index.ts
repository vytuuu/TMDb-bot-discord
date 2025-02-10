import {
  WatchCommandComponents,
  WatchCommandEmbed,
} from "@components/watch/command";
import { TvInfoComponents, TvInfoEmbed } from "@components/watch/tv/TvInfo";
import { BaseInteraction, Client, Events } from "discord.js";

module.exports = {
  name: Events.InteractionCreate,
  async execute(client: Client, interaction: BaseInteraction) {
    if (interaction.isButton()) {
      switch (interaction.customId) {
        case "back-to-home": {
          await interaction.update({
            embeds: await WatchCommandEmbed(),
            components: await WatchCommandComponents(),
          });
          break;
        }
      }
      if (interaction.customId.startsWith("back-to-info-tv-show")) {
        const [, tvId] = interaction.customId.split("_");
        await interaction.update({
          embeds: await TvInfoEmbed(tvId),
          components: await TvInfoComponents(tvId),
        });
      }
    }
  },
};
