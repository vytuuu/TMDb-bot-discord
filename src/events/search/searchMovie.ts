import {
  SearchMovieComponents,
  SearchMovieEmbed,
} from "@components/search/movie";
import {
  MovieInfoComponents,
  MovieInfoEmbed,
} from "@components/watch/movie/MovieInfo";
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
    //Selecionando um filme
    if (interaction.isStringSelectMenu()) {
      switch (interaction.customId) {
        //Selecionando um filme do top 10
        case "select-top-10-movies": {
          const movieId = interaction.values[0];
          await interaction.update({
            embeds: await MovieInfoEmbed(movieId),
            components: await MovieInfoComponents(movieId),
          });
          break;
        }
        //Selecionando um filme da pesquisa
        case "select-movie": {
          const movieId = interaction.values[0];
          await interaction.update({
            embeds: await MovieInfoEmbed(movieId),
            components: await MovieInfoComponents(movieId),
          });
        }
      }
    }

    //Exibindo o modal para pesquisa do filme
    if (interaction.isButton()) {
      if (interaction.customId === "search-movie") {
        const modal = new ModalBuilder()
          .setCustomId("search-movie")
          .setTitle("🔎 Procurando um filme...");

        const movieInput = new TextInputBuilder()
          .setCustomId("movie")
          .setLabel("Digite o nome do filme")
          .setStyle(TextInputStyle.Paragraph);

        const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
          movieInput
        );
        modal.addComponents(row);
        await interaction.showModal(modal);
      }
    }

    //Submit do modal de procura do filme
    if (interaction.isModalSubmit()) {
      if (interaction.customId === "search-movie") {
        const movieName = interaction.fields.getTextInputValue("movie");
        await (interaction as any).update({
          embeds: await SearchMovieEmbed(movieName, 1),
          components: await SearchMovieComponents(movieName, 1),
        });
      }
    }

    //Páginas para filmes
    if (interaction.isButton()) {
      const [action, movieName, page] = interaction.customId.split(":");
      if (action === "prevPage-movie" || action === "nextPage-movie") {
        const currentPage = parseInt(page);
        await interaction.update({
          embeds: await SearchMovieEmbed(movieName, currentPage),
          components: await SearchMovieComponents(movieName, currentPage),
        });
      }
    }
  },
};
