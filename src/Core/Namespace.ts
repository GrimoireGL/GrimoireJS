import NSIdentity from "./NSIdentity";
import Utility from "../Tools/Utility";

export default class Namespace {

  private _ns: string[];

  /**
   * create new Namespace instance.
   * You can include dots in the name
   * @param  {string[]}  ...name [description]
   * @return {Namespace}         [description]
   */
  public static define(...name: string[]): Namespace {
    return Namespace.defineByArray(name);
  }

  public static defineByArray(name: string[]): Namespace {
    return new Namespace(Utility.flat(name.map(n => n.split(".").filter(s => s !== ""))));
  }

  /**
   * Represents a namespace hierarchy as string array.
   */
  public get hierarchy(): string[] {
    return this._ns;
  }

  /**
   * Represents a namespace hierarchy as string joined by '.'.
   */
  public get qualifiedName(): string {
    return this._ns.join(".");
  }

  /**
   * generate new Namespace instance extended hierarchy.
   * @param extension extend name
   */
  public extend(extension: string): Namespace {
    if (extension == null) {
      throw new Error("Namespace can not extend with null");
    }

    let split = extension.split(".").filter(s => s !== "");
    if (split.length === 1 && extension === "") {
      return new Namespace(this._ns);
    }
    return new Namespace(this._ns.concat(split));
  }

  /**
   * to NSIdentity with name
   * @param name name
   */
  public for(name: string): NSIdentity {
    if (!name) {
      throw new Error("name must not be null");
    }
    const fqn = `${this.hierarchy.join(".")}.${name}`;
    return NSIdentity.fromFQN(fqn);
  }

  public toString(): string {
    return this.qualifiedName;
  }

  private constructor(names: string[]) {
    this._ns = names;
  }
}
