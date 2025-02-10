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
import { TvShowType } from "src/types";

export const SearchTVComponents = async (TvName: string, page: number) => {
  const { data } = await api.get(`search/tv?query=${TvName}&page=${page}`);

  if (data.total_results === 0) {
    return [new ActionRowBuilder<ButtonBuilder>().addComponents(BackToHome())];
  }

  return [
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("select-tv")
        .setPlaceholder("🔎 Selecione uma série/anime")
        .addOptions(
          data.results.slice(0, 20).map((tv: TvShowType, i: number) => {
            return {
              label: `${i + 1}. ${tv.name.slice(0, 40)}...`,
              description: `${tv.overview.slice(0, 60)}...`,
              value: tv.id.toString(),
            };
          })
        )
    ),
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`prevPage-tv:${TvName}:${page - 1}`)
        .setEmoji("⬅️")
        .setLabel("Página Anterior")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(page === 1),
      new ButtonBuilder()
        .setCustomId(`nextPage-tv:${TvName}:${page + 1}`)
        .setEmoji("➡️")
        .setLabel("Próxima Página")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(page === data.total_pages),
      BackToHome()
    ),
  ];
};

export const SearchTVEmbed = async (TvName: string, page: number) => {
  const { data } = await api.get(`search/tv?query=${TvName}&page=${page}`);
  if (data.total_results === 0) {
    return [
      new EmbedBuilder().setColor(settings.color).setFooter({
        text: "🍿 Não fique triste, pegue sua pipoca e procure outra série!",
      }).setDescription(`
### 🙁 Poxa...
*Nenhuma série/anime com o nome "${TvName}" foi encontrado.
Talvez você tenha digitado algo errado?*
`),
    ];
  }

  return [
    new EmbedBuilder()
      .setFooter({ text: `Página ${page} de ${data.total_pages}` })
      .setColor(settings.color).setDescription(`
${data.results
  .map((tv: TvShowType, i: number) => {
    const { fullStars, emptyStars } = getMovieStars(tv.vote_average);

    return `
${i + 1}. **${tv.name}**
${fullStars.map(() => icon.star).join("")}${emptyStars
      .map(() => icon.emptyStar)
      .join("")} (IMDb: ${tv.vote_average.toFixed(1)}/10)`;
  })
  .join("")}
`),
  ];
};
