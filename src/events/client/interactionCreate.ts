import { Interaction, CommandInteraction, Events } from "discord.js";
import { CustomClient } from "../../types/client";

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(client: CustomClient, interaction: Interaction) {
    if (!interaction.isCommand()) return;
    if (!interaction.guild) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `Sem comando correspondente para ${interaction.commandName}`
      );
      return;
    }

    try {
      await command.execute(client, interaction as CommandInteraction);
    } catch (error) {
      console.error(
        `Erro ao executar o comando ${interaction.commandName}:`,
        error
      );
      await interaction.reply({
        content: "Houve um erro ao executar este comando.",
        ephemeral: true,
      });
    }
  },
};
