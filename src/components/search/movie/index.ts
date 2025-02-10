import { BackToHome } from "@components/index";
import { icon, settings } from "@config/index";
import { getMovieStars } from "@utils/getMovieStars";
import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { api } from "src/api";
import { MovieType } from "src/types";

export const SearchMovieComponents = async (
  MovieName: string,
  page: number
) => {
  const { data } = await api.get(
    `search/movie?query=${MovieName}&page=${page}`
  );

  if (data.total_results === 0) {
    return [new ActionRowBuilder<ButtonBuilder>().addComponents(BackToHome())];
  }

  return [
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("select-movie")
        .setPlaceholder("🔎 Selecione um filme")
        .addOptions(
          data.results.slice(0, 20).map((movie: MovieType, i: number) => {
            return {
              label: `${i + 1}. ${movie.title.slice(0, 40)}...`,
              description: `${movie.overview.slice(0, 60)}...`,
              value: movie.id.toString(),
            };
          })
        )
    ),
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`prevPage-movie:${MovieName}:${page - 1}`)
        .setEmoji("⬅️")
        .setLabel("Página Anterior")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(page === 1),
      new ButtonBuilder()
        .setCustomId(`nextPage-movie:${MovieName}:${page + 1}`)
        .setEmoji("➡️")
        .setLabel("Próxima Página")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(page === data.total_pages),
      BackToHome()
    ),
  ];
};

export const SearchMovieEmbed = async (MovieName: string, page: number) => {
  const { data } = await api.get(
    `search/movie?query=${MovieName}&page=${page}`
  );
  if (data.total_results === 0) {
    return [
      new EmbedBuilder().setColor(settings.color).setFooter({
        text: "🍿 Não fique triste, pegue sua pipoca e procure outro filme!",
      }).setDescription(`
### 🙁 Poxa...
*Nenhum filme com o nome "${MovieName}" foi encontrado.
Talvez você tenha digitado algo errado?*
`),
    ];
  }

  return [
    new EmbedBuilder()
      .setFooter({ text: `Página ${page} de ${data.total_pages}` })
      .setColor(settings.color).setDescription(`
${data.results
  .map((movie: MovieType, i: number) => {
    const { fullStars, emptyStars } = getMovieStars(movie.vote_average);

    return `
${i + 1}. **${movie.title}**
${fullStars.map(() => icon.star).join("")}${emptyStars
      .map(() => icon.emptyStar)
      .join("")} - IMDb: ${movie.vote_average.toFixed(1)}/10`;
  })
  .join("")}
`),
  ];
};
