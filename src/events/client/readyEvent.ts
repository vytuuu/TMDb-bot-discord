import chalk from "chalk";
import { settings } from "@config/index";
import { ActivityType, Client, Events, PresenceUpdateStatus } from "discord.js";

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    client.user?.setActivity(settings.status, {
      type: ActivityType.Listening,
    }); 
    client.user?.setStatus(PresenceUpdateStatus.DoNotDisturb);
    console.log(
      `${chalk.whiteBright("[READY]")} ${chalk.yellowBright(
        `🌞 Estou online!`
      )}`
    );
  },
};
