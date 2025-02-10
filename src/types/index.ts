import { ColorResolvable } from "discord.js";

export interface MovieType {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
}

export interface TvShowType {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  last_air_date: string;
  vote_average: number;
}
export interface TvShowSeasonType {
  id: number;
  name: string;
  season_number: number;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  episode_count: number;
  air_date: string;
  vote_average: number;
}

export interface settingsType {
  color: ColorResolvable;
  status: string;
  footer: string;
}
