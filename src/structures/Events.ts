import CustomClient from "./client";

interface customEvent {
  name: string;
  params: any;
  client: CustomClient;
  emitter: any;
  type: string;
}

interface options {
  once?: boolean;
  emitter?: any;
}
class customEvent {
  constructor(client: CustomClient, name: string, options: options = {}) {
    this.name = name;
    this.client = client;
    this.type = options.once ? "once" : "on";
    this.emitter =
      (typeof options.emitter === "string"
        ? //@ts-ignore
          this.client[options.emitter]
        : options.emitter) || this.client;
  }

  async run(...args: any) {
    throw new Error(`The run method has not been implemented in ${this.name}`);
  }
}

export default customEvent;
