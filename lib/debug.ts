import Debug from "debug";

class DebugManager {
  debug: Debug.Debugger;

  constructor(rootNamespace: string) {
    this.debug = Debug(rootNamespace);
  }

  extend(namespace: string) {
    return this.debug.extend(namespace);
  }
}

export default new DebugManager("catalyst-ui");
