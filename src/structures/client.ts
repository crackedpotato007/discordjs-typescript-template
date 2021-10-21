import { Client, ClientOptions, Interaction, InviteGuild } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { readdirSync } from "fs";
import { config } from "dotenv-safe";
import { parse } from "path";
config();

interface CustomClient {
  prisma: PrismaClient;
  commands: Map<string, any>;
}
class CustomClient extends Client {
  constructor(ClientOptions: ClientOptions) {
    super(ClientOptions);
    this.prisma = new PrismaClient();
    this.registerEvents();
    this.commands = new Map();
    this.registerCommands();
  }
  async start() {
    await this.prisma.$connect();
    this.login(process.env.TOKEN);
  }

  async registerCommands() {
    console.log("Registering commands...");
    const files = readdirSync("./src/commands");
    for (const file of files) {
      const innerFiles = readdirSync(`./src/commands/${file}`);
      for (const innerFile of innerFiles) {
        console.log(`Registering ${innerFile}`);
        const command = await import(`../commands/${file}/${innerFile}`);
        this.commands.set(command.default.name, command.default);
      }
    }
  }
  async registerEvents() {
    console.log("Registering events...");
    const events = readdirSync("./src/events");
    for (const event of events) {
      if (!event.endsWith(".ts")) return;
      const file = await import(`../events/${event}`);
      const { name } = parse(event);
      const eventOBJ = new file.default(this, name);
      this.on(eventOBJ.name, eventOBJ.run.bind(null, this));
    }
  }
}

export default CustomClient;
