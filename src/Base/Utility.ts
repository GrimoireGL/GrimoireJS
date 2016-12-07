import GrimoireInterface from "../GrimoireInterface";


export default class Utility {
  public static w(message: string): void {
    if (GrimoireInterface.debug) {
      console.warn(message);
    }
  }
}
