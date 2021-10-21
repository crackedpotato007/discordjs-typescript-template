import customEvent from "../structures/Events";

class readyEvent extends customEvent {
  constructor(...args: any[]) {
    //@ts-ignore
    super(...args, {
      name: "ready",
      once: true,
    });
  }
  async run(client: any) {
    console.log(`${client.user.tag} is ready`);
  }
}

export default readyEvent;
