import GrimoireInterface from "../GrimoireInterface";


export default class Utility {
  public static w(message: string): void {
    if (GrimoireInterface.debug) {
      console.warn(message);
    }
  }
  public static isCamelCase(str: string): boolean {
    return /^[A-Z][a-zA-Z0-9]*$/.test(str);
  }
  public static isSnakeCase(str: string): boolean {
    return /^[a-z0-9\-]+$/.test(str);
  }
}
