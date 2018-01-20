import Component from "../Core/Component";
import ComponentDeclaration from "../Core/ComponentDeclaration";
import Environment from "../Core/Environment";
import Identity from "../Core/Identity";
import IdentityMap from "../Core/IdentityMap";
import { IConverterDeclaration } from "../Interface/IAttributeConverterDeclaration";
import {
  ComponentIdentifier,
  ComponentRegistering,
  Ctor,
  Name,
  Nullable,
} from "./Types";
import Utility from "./Utility";

/**
 * Provides static methods to ensure arguments are valid type.
 */
export default class Ensure {

  /**
   * name or constructor to be identity
   * @param component
   */
  public static tobeComponentIdentity(component: Ctor<Component> | ComponentIdentifier): Identity {
    if (Utility.isName(component)) {
      return Ensure.tobeIdentity(component);
    } else {
      const obj = ComponentDeclaration.ctorMap.find(o => o.ctor === component);
      if (obj) {
        return obj.name;
      } else {
        throw new Error("Specified constructor have not registered to current context.");
      }
    }
  }
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
   * string or Identity ensure to be Identity.
   * @param  {Name}       name [description]
   * @return {Identity}      [description]
   */
  public static tobeIdentity(name: Name): Identity {
    if (!name) {
      throw Error("argument can not be null or undefined.");
    }
    if (typeof name === "string") {
      const fqn = Ensure.tobeFQN(name);
      if (fqn) {
        return Identity.fromFQN(fqn);
      }
      return Identity.guess(name);
    } else {
      return name;
    }
  }

  /**
   * check argument is Name.
   * that is argument is string or instance of Identity.
   * @param obj
   */
  public static isName(obj: any): obj is Name {
    return typeof obj === "string" || obj instanceof Identity;
  }

  /**
   * Internal use!
   * @param identity
   */
  public static tobeCnverterName(identity: Name | IConverterDeclaration): Name {
    if (Ensure.isName(identity)) {
      return identity;
    }
    return identity.name;
  }

  /**
   * Internal use!
   * @param names
   * @deprecated
   */
  public static tobeNSIdentityArray(names: Name[]): Identity[] {
    if (!names) {
      return [];
    }
    const newArr: Identity[] = [];
    for (let i = 0; i < names.length; i++) {
      newArr.push(this.tobeIdentity(names[i]));
    }
    return newArr;
  }

  /**
   * object or IdentityMap to be IdentityMap
   * @param dict
   */
  public static tobeIdentityMap<T>(dict: IdentityMap<T> | { [key: string]: T }): IdentityMap<T> {
    if (!dict) {
      return new IdentityMap<T>();
    }
    if (dict instanceof IdentityMap) {
      return dict;
    } else {
      const newDict = new IdentityMap<T>();
      for (const key in dict) {
        newDict.set(Identity.guess(key), dict[key]);
      }
      return newDict;
    }
  }

  /**
   * Internal use!
   * Add '$$' to the beginning of the string if it does not start with '$$'
   * @param message
   */
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
      const dec = Environment.GrimoireInterface.componentDeclarations.get(c);
      if (dec) {
        return dec.ctor as any as Ctor<T>;
      }
      return null;
    }
  }

  /**
   * return fqn string if name is identity or fqn string.
   * return null if name is string but is not start with '_'.
   * @param name
   */
  public static tobeFQN(name: Name): Nullable<string> {
    if (typeof name === "string") {
      if (Ensure.checkFQNString(name)) {
        return name.substring(1);
      }
      return null;
    } else {
      return name.fqn;
    }
  }

  /**
   * check string is FQN format
   * FQN format is just name start with '_'
   * @param  {string}  name [description]
   * @return {boolean}      [description]
   */
  public static checkFQNString(name: string): boolean {
    return name.startsWith("_");
  }

  /**
   * internal use!
   * @param  {[type]} typeofname==="string"||nameinstanceofNSIdentity [description]
   * @return {[type]}                                                 [description]
   */
  public static tobeName<T>(name: Name | ComponentRegistering<T>): Name {
    if (typeof name === "string" || name instanceof Identity) {
      return name;
    }
    return name.componentName;
  }
}
