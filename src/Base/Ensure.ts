import Component from "../Node/Component";
import GrimoireInterface from "../GrimoireInterface";
import NSIdentity from "./NSIdentity";
import NSDictionary from "./NSDictionary";
/**
 * Provides static methods to ensure arguments are valid type.
 */
class Ensure {
  /**
   * Ensure specified str being string
   * @param  {string | number}      str [description]
   * @return {string}      [description]
   */
  public static ensureString(str: string | number): string {
    if (typeof str === "string") {
      return str;
    } else if (typeof str === "number") {
      return str.toString();
    } else {
      throw new Error("Specified argument can not convert into string");
    }
  }

  /**
   * Ensure specified number being number
   * @param  {string | number}      str [description]
   * @return {string}      [description]
   */
  public static ensureNumber(num: string | number): number {
    if (typeof num === "string") {
      return parseInt(num, 10);
    } else if (typeof num === "number") {
      return num;
    } else {
      throw new Error("specified argument can not be converted into number");
    }
  }

  public static ensureTobeNSIdentity(name: string | NSIdentity): NSIdentity {
    if (!name) {
      return undefined;
    }
    if (typeof name === "string") {
      if (name.indexOf("|") !== -1) {//name is fqn
        return NSIdentity.fromFQN(name)
      }
      return NSIdentity.from(name);
    } else {
      return name;
    }
  }

  public static ensureTobeNSIdentityArray(names: (string | NSIdentity)[]): NSIdentity[] {
    if (!names) {
      return [];
    }
    const newArr: NSIdentity[] = [];
    for (let i = 0; i < names.length; i++) {
      newArr.push(this.ensureTobeNSIdentity(names[i]));
    }
    return newArr;
  }

  public static ensureTobeNSDictionary<T>(dict: NSDictionary<T> | { [key: string]: T }, defaultNamespace: string): NSDictionary<T> {
    if (!dict) {
      return new NSDictionary<T>();
    }
    if (dict instanceof NSDictionary) {
      return dict;
    } else {
      const newDict = new NSDictionary<T>();
      for (let key in dict) {
        newDict.set(NSIdentity.from(defaultNamespace, key), dict[key]);
      }
      return newDict;
    }
  }

  public static ensureTobeMessage(message: string): string {
    if (message.startsWith("$")) {
      if (message.startsWith("$$")) {
        return message;
      } else {
        return "$" + message;
      }
    } else {
      return "$$" + message;
    }
  }
  public static ensureTobeComponentConstructor<T>(c: string | NSIdentity | (new () => T)): (new () => T) {
    if (typeof c === "function") {
      return c;
    } else if (typeof c === "string") {
      return GrimoireInterface.componentDeclarations.get(c).ctor as any as (new () => T);
    } else {
      return GrimoireInterface.componentDeclarations.get(c).ctor as any as (new () => T);
    }
  }
}

export default Ensure;
