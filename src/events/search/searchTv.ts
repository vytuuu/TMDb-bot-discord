import { SearchTVComponents, SearchTVEmbed } from "@components/search/tv";
import {
  TvInfoComponents,
  TvInfoEmbed,
  TvinfoTempComponents,
  TvInfoTempEmbed,
} from "@components/watch/tv/TvInfo";
import {
  ActionRowBuilder,
  BaseInteraction,
  Client,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

module.exports = {
  name: Events.InteractionCreate,

  async execute(client: Client, interaction: BaseInteraction) {
    if (interaction.isStringSelectMenu()) {
      switch (interaction.customId) {
        case "select-top-10-tv": {
          const tvId = interaction.values[0];
          await interaction.update({
            embeds: await TvInfoEmbed(tvId),
            components: await TvInfoComponents(tvId),
          });
          break;
        }
        case "select-tv-temp": {
          const [id, season] = interaction.values[0].split("-");
          await interaction.update({
            embeds: await TvInfoTempEmbed(id, season),
            components: await TvinfoTempComponents(id, season),
          });
          break;
        }
      }
    }

    //Exibindo modal para pesquisa da serie/anime
    if (interaction.isButton()) {
      if (interaction.customId === "search-series") {
        const modal = new ModalBuilder()
          .setCustomId("search-series")
          .setTitle("🔎 Procurando uma série/anime...");

        const movieInput = new TextInputBuilder()
          .setCustomId("serie")
          .setLabel("Digite o nome da série/anime...")
          .setStyle(TextInputStyle.Paragraph);

        const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
          movieInput
        );
        modal.addComponents(row);
        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === "search-series") {
        const serieName = interaction.fields.getTextInputValue("serie");
        await (interaction as any).update({
          embeds: await SearchTVEmbed(serieName, 1),
          components: await SearchTVComponents(serieName, 1),
        });
      }
    }

    //Selecionando uma série/anime
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === "select-tv") {
        const tvId = interaction.values[0];
        await interaction.update({
          embeds: await TvInfoEmbed(tvId),
          components: await TvInfoComponents(tvId),
        });
      }
    }

    //Páginas para séries
    if (interaction.isButton()) {
      const [action, movieName, page] = interaction.customId.split(":");
      if (action === "prevPage-movie" || action === "nextPage-movie") {
        const currentPage = parseInt(page);
        await interaction.update({
          embeds: await SearchTVEmbed(movieName, currentPage),
          components: await SearchTVComponents(movieName, currentPage),
        });
      }
    }
  },
};
