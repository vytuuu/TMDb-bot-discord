import { icon, settings } from "@config/index";
import { getMovieStars } from "@utils/getMovieStars";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { api } from "src/api";
import { MovieType, TvShowType } from "src/types";

export const WatchCommandEmbed = async () => {
  const movies = await api.get("trending/movie/day");
  const tvshows = await api.get("trending/tv/day");
  const FirstMovie = movies.data.results[0] as MovieType;
  const FirstTvShow = tvshows.data.results[0] as TvShowType;

  return [
    new EmbedBuilder()
      .setImage(
        "https://image.tmdb.org/t/p/original/" + FirstMovie.backdrop_path
      )
      .setDescription(
        `
# Top 10 Filmes 🔥
${movies.data.results
  .slice(0, 10)
  .map((movie: MovieType, i: any) => {
    const { fullStars, emptyStars } = getMovieStars(movie.vote_average);

    return `${i + 1}. **${movie.title}**
${fullStars.map((i) => `${icon.star}`).join("")}${emptyStars
      .map((i) => `${icon.emptyStar}`)
      .join("")} (${icon.imdb} ${movie.vote_average.toFixed(1)}/10)`;
  })
  .join("\n")}
`
      )
      .setFooter({ text: `🎬 Este é o top 10 filmes do momento` })
      .setColor(settings.color),
    new EmbedBuilder()
      .setImage(
        "https://image.tmdb.org/t/p/original/" + FirstTvShow.backdrop_path
      )
      .setDescription(
        `
# Top 10 Séries 🔥
${tvshows.data.results
  .slice(0, 10)
  .map((tv: TvShowType, i: any) => {
    const { fullStars, emptyStars } = getMovieStars(tv.vote_average);

    return `${i + 1}. **${tv.name}**
${fullStars.map((i) => `${icon.star}`).join("")}${emptyStars
      .map((i) => `${icon.emptyStar}`)
      .join("")}  (${icon.imdb} ${tv.vote_average.toFixed(1)}/10)`;
  })
  .join("\n")}
`
      )
      .setFooter({ text: `📺 Este é o top 10 séries do momento` })
      .setColor(settings.color),
  ];
};

export const WatchCommandComponents = async () => {
  const movies = await api.get("trending/movie/day");
  const tvshows = await api.get("trending/tv/day");

  return [
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("select-top-10-movies")
        .setPlaceholder("🎬 Top 10 Filmes – Escolha e assista agora!")
        .addOptions(
          movies.data.results.slice(0, 10).map((movie: MovieType, i: any) => {
            const { fullStars } = getMovieStars(movie.vote_average);
            return {
              label: `${i + 1}. ${movie.title}`,
              description: `${fullStars
                .map((i) => `⭐`)
                .join("")} IMDb: ${movie.vote_average.toFixed(1)}/10`,
              value: movie.id.toString(),
            };
          })
        )
    ),
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("select-top-10-tv")
        .setPlaceholder("📺 Top 10 Séries – Veja a sua próxima maratona!")
        .addOptions(
          tvshows.data.results.slice(0, 10).map((tv: TvShowType, i: any) => {
            const { fullStars } = getMovieStars(tv.vote_average);
            return {
              label: `${i + 1}. ${tv.name}`,
              description: `${fullStars
                .map((i) => `⭐`)
                .join("")} IMDb: ${tv.vote_average.toFixed(1)}/10`,
              value: tv.id.toString(),
            };
          })
        )
    ),
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("search-movie")
        .setLabel("Procurar um Filme")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🎬"),
      new ButtonBuilder()
        .setCustomId("search-series")
        .setLabel("Procurar uma Série/Anime")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("📺")
    ),
  ];
};
