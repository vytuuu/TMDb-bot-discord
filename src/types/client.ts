import {
  ApplicationCommandOptionData,
  Client,
  Collection,
  CommandInteraction,
} from "discord.js";

interface ExtendedClient {
  commands: Collection<string, Command>;
}

interface Command {
  name: string;
  description: string;
  default_member_permissions?: string | number;
  options?: ApplicationCommandOptionData[];
  execute(client: CustomClient, interaction: CommandInteraction): Promise<void>;
}

class CustomClient extends Client implements ExtendedClient {
  public commands: Collection<string, Command>;

  constructor(options: any) {
    super(options);
    this.commands = new Collection();
  }
}

export { CustomClient, Command };
