import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  timeout: 5000,
  headers: {
    accept: "application/json",
  },
  params: {
    api_key: process.env.TMDB_KEY,
    language: "pt-BR",
  },
});
