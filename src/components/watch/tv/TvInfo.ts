import { BackToHome, BackToInfoTvShow } from "@components/index";
import { icon, settings } from "@config/index";
import { FormatDate } from "@utils/FormatDate";
import { GetDuration } from "@utils/FormatTime";
import { getMovieStars } from "@utils/getMovieStars";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { api } from "src/api";
import { TvShowSeasonType } from "src/types";

export const TvInfoEmbed = async (tvId: string) => {
  const Tv = await api.get(`tv/${tvId}`);

  const FirstAirDate = FormatDate(Tv.data.first_air_date);
  const LastAirDate = FormatDate(Tv.data.last_air_date);
  const { fullStars, emptyStars } = getMovieStars(Tv.data.vote_average);

  return [
    new EmbedBuilder()
      .setThumbnail(
        "https://image.tmdb.org/t/p/original/" + Tv.data.poster_path
      )
      .setImage("https://image.tmdb.org/t/p/original/" + Tv.data.backdrop_path)
      .setFooter(Tv.data.tagline ? { text: Tv.data.tagline } : null)
      .setColor(settings.color).setDescription(`
# ${Tv.data.name}

*${Tv.data.overview || "Poxa, essa série ainda não possui uma sinopse..."}*

- Titúlo original: **${Tv.data.original_name}**
- Último episódio lançado: Temporada ${
      Tv.data.last_episode_to_air.season_number
    } Episódio ${Tv.data.last_episode_to_air.episode_number} (**${
      Tv.data.last_episode_to_air.name
    }**) - (**${LastAirDate}**)
- Em andamento: **${Tv.data.in_production ? "Sim" : "Não"}**
- Data de lançamento: **${FirstAirDate}**
- Avaliação: ${fullStars.map((i) => `${icon.star}`).join("")}${emptyStars
      .map((i) => `${icon.emptyStar}`)
      .join("")}  (${icon.imdb} ${Tv.data.vote_average.toFixed(1)}/10)
- Direção: ${Tv.data.created_by
      .map((creator: any) => `**${creator.name}**`)
      .join(", ")}
- Gêneros: ${Tv.data.genres.map((genre: any) => `**${genre.name}**`).join(", ")}
- Disponível em: ${Tv.data.networks.map(
      (network: any) => `**${network.name}**`
    )}
        `),
  ];
};
export const TvInfoComponents = async (tvId: string) => {
  const TvShow = await api.get(`tv/${tvId}`);
  const IMDbId = (await api.get(`tv/${tvId}/external_ids`)).data.imdb_id;
  const WatchUrl = `https://embed.warezcdn.com/serie/${IMDbId}`;

  return [
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("select-tv-temp")
        .setPlaceholder("📅 Selecionar temporada")
        .addOptions(
          TvShow.data.seasons.map((s: TvShowSeasonType, i: any) => {
            const { fullStars } = getMovieStars(s.vote_average);
            return {
              label: `${s.name} (${s.episode_count} Episódios)`,
              description: `${
                fullStars.length > 0
                  ? fullStars.map(() => `⭐`).join("")
                  : "Sem avaliação"
              } IMDb: ${s.vote_average.toFixed(1)}/10`,
              value: `${TvShow.data.id}-${s.season_number}`,
            };
          })
        )
    ),
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

export const TvInfoTempEmbed = async (tvId: string, season: string) => {
  const TvShow = await api.get(`tv/${tvId}`);
  const Season = await api.get(`tv/${tvId}/season/${season}`);
  const { fullStars, emptyStars } = getMovieStars(Season.data.vote_average);
  const lastEpisode = Season.data.episodes[Season.data.episodes.length - 1];

  return [
    new EmbedBuilder()
      .setThumbnail(
        "https://image.tmdb.org/t/p/original/" + Season.data.poster_path
      )
      .setColor(settings.color).setDescription(`
# ${TvShow.data.name} - ${Season.data.name}
*${
      Season.data.overview ||
      "Poxa, essa temporada ainda não possui uma sinopse..."
    }*

* Último episódio: **${lastEpisode.name}**
  * Temporada: **${Season.data.season_number}**
  * Episódio: **${lastEpisode.episode_number}**
  * Data de estreia: **${FormatDate(lastEpisode.air_date)}**
  * Duração: **${
    lastEpisode.runtime ? GetDuration(lastEpisode.runtime) : "N/A"
  }**
  * Epsódio final: **${lastEpisode.episode_type === "finale" ? "Sim" : "Não"}**
  * Sinopse: ***${
    lastEpisode.overview || "Este episódio não possui uma sinopse..."
  }***
* Data de estreia: **${FormatDate(TvShow.data.first_air_date)}**
* Data de lançamento: **${FormatDate(Season.data.air_date)}**
* Avaliação: ${fullStars.map((i) => `${icon.star}`).join("")}${emptyStars
      .map((i) => `${icon.emptyStar}`)
      .join("")}  (${icon.imdb} ${Season.data.vote_average.toFixed(1)}/10)
`),
  ];
};

export const TvinfoTempComponents = async (tvId: string, season: string) => {
  const IMDbId = (await api.get(`tv/${tvId}/external_ids`)).data.imdb_id;
  const WatchUrl = `https://embed.warezcdn.com/serie/${IMDbId}/${season}`;
  const Season = await api.get(`tv/${tvId}/season/${season}`);
  return [
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setEmoji("📺")
        .setLabel(`Assistir ${Season.data.name}`)
        .setURL(WatchUrl)
        .setStyle(ButtonStyle.Link),
      BackToInfoTvShow(tvId)
    ),
  ];
};
