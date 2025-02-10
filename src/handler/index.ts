import { readdirSync, statSync } from "fs";
import { join } from "path";
import { Command, CustomClient } from "../types/client";
import { REST, Routes, Client } from "discord.js";
import chalk from "chalk";

// Função para verificar se o arquivo é .js ou .ts
const isJavaScriptOrTypeScript = (fileName: string) => {
  return fileName.endsWith(".js") || fileName.endsWith(".ts");
};

export function loadCommands(client: CustomClient, directory: string) {
  const files = readdirSync(directory);

  files.forEach((file) => {
    const filePath = join(directory, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      loadCommands(client, filePath); // Carrega comandos de subdiretórios
    } else if (stat.isFile() && isJavaScriptOrTypeScript(file)) {
      // Verifica se é um arquivo JS ou TS
      try {
        const command = require(filePath);
        client.commands.set(command.name, command);
      } catch (error) {
        console.error(`Failed to load command from ${filePath}:`, error);
      }
    }
  });
}

function loadEventsFromDirectory(client: Client, directory: string) {
  const filesAndFolders = readdirSync(directory);

  filesAndFolders.forEach((name) => {
    const fullPath = join(directory, name);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      loadEventsFromDirectory(client, fullPath); // Carrega eventos de subdiretórios
    } else if (stat.isFile() && isJavaScriptOrTypeScript(name)) {
      // Verifica se é um arquivo JS ou TS
      try {
        const event = require(fullPath);
        const handler = (...args: any[]) => event.execute(client, ...args);

        if (event.once) {
          client.once(event.name, handler);
        } else {
          client.on(event.name, handler);
        }
      } catch (error) {
        console.error(`Failed to load event from ${fullPath}:`, error);
      }
    }
  });
}

export function loadEvents(client: Client, directory: string) {
  loadEventsFromDirectory(client, directory);
}

export async function registerCommands(client: CustomClient) {
  const rest = new REST({ version: "10" }).setToken(
    process.env.DISCORD_TOKEN as string
  );

  try {
    const commands = client.commands.map((cmd: Command) => ({
      name: cmd.name,
      description: cmd.description,
      options: cmd.options ?? [],
      default_member_permissions:
        cmd.default_member_permissions?.toString() ?? "0",
    }));

    await rest.put(Routes.applicationCommands(client.user?.id!), {
      body: commands,
    });

    console.log(
      `${chalk.whiteBright("[CLIENT]")} ${chalk.greenBright(
        "Successfully registered application commands."
      )}`
    );
  } catch (error) {
    console.error("Error registering commands:", error);
  }
}
