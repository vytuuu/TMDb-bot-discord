import { BackToHome } from "@components/index";
import { icon, settings } from "@config/index";
import { FormatDate } from "@utils/FormatDate";
import { GetDuration } from "@utils/FormatTime";
import { getMovieStars } from "@utils/getMovieStars";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { api } from "src/api";

export const MovieInfoEmbed = async (movieId: string) => {
  const Movie = await api.get(`movie/${movieId}`);
  const MovieTrailers = await api.get(`movie/${movieId}/videos`);
  
  const { fullStars, emptyStars } = getMovieStars(Movie.data.vote_average);
  return [
    new EmbedBuilder()
      .setThumbnail(
        "https://image.tmdb.org/t/p/original/" + Movie.data.poster_path
      )
      .setImage(
        "https://image.tmdb.org/t/p/original/" + Movie.data.backdrop_path
      )
      .setFooter(Movie.data.tagline ? { text: Movie.data.tagline } : null)
      .setColor(settings.color).setDescription(`
# ${Movie.data.title}
*${Movie.data.overview}*

- Titúlo original: **${Movie.data.original_title}**
- Duração: **${GetDuration(Movie.data.runtime)}**
- Lançado: **${Movie.data.status === "Released" ? "Sim" : "Não"}**
- Ano de lançamento: **${FormatDate(Movie.data.release_date)}**
- Orçamento: **${Number(Movie.data.budget).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })}**
- Receita: **${Number(Movie.data.revenue).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })}**
- Coleção **${
      Movie.data.belongs_to_collection?.name
        ? `${Movie.data.belongs_to_collection.name}`
        : "Nenhuma"
    }**
- Avaliação: ${fullStars.map((i) => `${icon.star}`).join("")} ${emptyStars
      .map((i) => `${icon.emptyStar}`)
      .join("")} - ${icon.imdb} **${Movie.data.vote_average.toFixed(1)}/10**
- Empresas de produção: ${Movie.data.production_companies
      .map((company: any) => `**${company.name}**`)
      .join(", ")}
- Gêneros: ${Movie.data.genres
      .map((genre: any) => `**${genre.name}**`)
      .join(", ")}

${
  MovieTrailers.data.results.length > 0
    ? `- Trailers: **${MovieTrailers.data.results
        .filter((video: any) => video.site === "YouTube")
        .map(
          (video: any) =>
            `[${video.name}](https://www.youtube.com/watch?v=${video.key})`
        )
        .join(", ")}**`
    : ""
}
          `),
  ];
};
export const MovieInfoComponents = async (movieId: string) => {
  const Movie = await api.get(`movie/${movieId}`);
  const WatchUrl = `https://embed.warezcdn.com/filme/${Movie.data.imdb_id}`;

  return [
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setEmoji("📺")
        .setLabel("Assistir")
        .setURL(WatchUrl)
        .setStyle(ButtonStyle.Link),
      BackToHome()
    ),
  ];
};
