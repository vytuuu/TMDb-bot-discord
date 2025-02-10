import { icon } from "@config/index";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export const BackToHome = () => {
  return new ButtonBuilder()
    .setCustomId("back-to-home")
    .setEmoji(icon.home)
    .setStyle(ButtonStyle.Secondary);
};

export const BackToInfoTvShow = (tvId: string) => {
  return new ButtonBuilder()
    .setCustomId(`back-to-info-tv-show_${tvId}`)
    .setEmoji("⬅️")
    .setStyle(ButtonStyle.Secondary);
};
