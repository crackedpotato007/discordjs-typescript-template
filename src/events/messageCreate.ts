import { Message, Collection } from "discord.js";
import CustomClient from "../structures/client";
import { msToTime } from "../structures/utils";
const cooldowns = new Collection();
import customEvent from "../structures/Events";

class messageEvent extends customEvent {
  constructor(...args: any[]) {
    //@ts-ignore
    super(...args, {
      name: "messageCreate",
    });
  }

  async run(client: CustomClient, message: Message) {
    if (message.author.bot) return;
    if (!process.env.PREFIX) return;
    if (!message.content.startsWith(process.env.PREFIX)) return;

    let msgargs = message.content
      .substring(process.env.PREFIX.length)
      .split(new RegExp(/\s+/));
    let cmdName = msgargs.shift()!.toLowerCase();
    if (message.channel.type !== "DM") {
      const command = client.commands.get(cmdName);
      if (!command) return;
      if (command.disabled === true) return;
      if (!message.member) return;
      if (command.perms && !message.member.permissions.has(command.perms))
        return;

      const cd = command.cooldown;
      if (cd) {
        if (!cooldowns.has(command.name)) {
          cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name) as Collection<any, any>;
        const cooldownAmount = cd * 1000;
        if (timestamps.has(message.author.id)) {
          const expirationTime =
            timestamps.get(message.author.id) + cooldownAmount;
          if (now < expirationTime)
            await message.channel.send(
              `${message.author.tag}, please wait \`${msToTime(
                expirationTime - now
              )}\` before using this command again.`
            );
          return;
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      }
      try {
        command.execute(client, message, msgargs);
      } catch (error: any) {
        message.channel.send(`Oops, something went wrong!`);
        console.log(
          `Error occured!\nAt command: ${command.name}\nError message: ${error.message}\nError trace: ${error.trace}`
        );
      }
    }
  }
}

export default messageEvent;
