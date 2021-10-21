import { Message } from "discord.js";
import CustomClient from "../../structures/client";

const cmd = {
  name: "test",
  description: "Test command",
  execute: (client: CustomClient, message: Message, args: Array<string>) => {
    message.channel.send("Test command executed");
  },
};

export default cmd;
