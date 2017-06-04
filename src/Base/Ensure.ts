import GrimoireInterface from "../Interface/GrimoireInterface";
import NSIdentity from "./NSIdentity";
// import Namespace from "./Namespace";
import NSDictionary from "./NSDictionary";
import {Name, Nullable, Ctor} from "./Types";
/**
 * Provides static methods to ensure arguments are valid type.
 */
export default class Ensure {
  /**
   * Ensure specified str being string
   * @param  {string | number}      str [description]
   * @return {string}      [description]
   */
  public static tobeString(str: string | number): string {
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
  public static tobeNumber(num: string | number): number {
    if (typeof num === "string") {
      return parseInt(num, 10);
    } else if (typeof num === "number") {
      return num;
    } else {
      throw new Error("specified argument can not be converted into number");
    }
  }

  /**
   * string or NSIdentity ensure to be NSIdentity.
   * @param  {Name}       name [description]
   * @return {NSIdentity}      [description]
   */
  public static tobeNSIdentity(name: Name): NSIdentity {
    if (!name) {
      throw Error(`argument can not be null or undefined.`);
    }
    if (typeof name === "string") {
      return NSIdentity.guess(name);
    } else {
      return name;
    }
  }

  public static tobeNSIdentityArray(names: Name[]): NSIdentity[] {
    if (!names) {
      return [];
    }
    const newArr: NSIdentity[] = [];
    for (let i = 0; i < names.length; i++) {
      newArr.push(this.tobeNSIdentity(names[i]));
    }
    return newArr;
  }

  public static tobeNSDictionary<T>(dict: NSDictionary<T> | { [key: string]: T }): NSDictionary<T> {
    if (!dict) {
      return new NSDictionary<T>();
    }
    if (dict instanceof NSDictionary) {
      return dict;
    } else {
      const newDict = new NSDictionary<T>();
      for (let key in dict) {
        newDict.set(NSIdentity.guess(key), dict[key]);
      }
      return newDict;
    }
  }

  public static tobeMessage(message: string): string {
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

  /**
   * string, NSIdentity or constructor ensure to be constructor.
   * return null if identity is not registered as component.
   * @param  {[type]} typeofc==="function" [description]
   * @return {[type]}                      [description]
   */
  public static tobeComponentConstructor<T>(c: Name | Ctor<T>): Nullable<Ctor<T>> {
    if (typeof c === "function") {
      return c;
    } else {
      const dec = GrimoireInterface.componentDeclarations.get(c);
      if (dec) {
        return dec.ctor as any as Ctor<T>;
      }
      return null;
    }
  }
}
