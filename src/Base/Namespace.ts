import NSIdentity from "./NSIdentity";
import Utility from "./Utility";

export default class Namespace {

  private _ns: string[];
  public static define(...name: string[]): Namespace {
    return Namespace.defineByArray(name);
  }
  public static defineByArray(name: string[]): Namespace {
    return new Namespace(Utility.flat(name.map(n => n.split("."))));
  }

  public get hierarchy(): string[] {
    return this._ns;
  }
  public get qualifiedName(): string {
    return this._ns.join(".");
  }
  public extend(extension: string): Namespace {
    return new Namespace(this._ns.concat([extension]));
  }
  public for(name: string): NSIdentity {
    return NSIdentity.fromFQN(this, name);
  }
  public toString(): string {
    return this.qualifiedName;
  }

  private constructor(names: string[]) {
    this._ns = names;
  }
}
