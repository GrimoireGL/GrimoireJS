import Namespace from "./Namespace";
import IdResolver from "../Tools/IdResolver";
import Ensure from "../Tools/Ensure";

/**
 * The class to identity with XML namespace feature.
 */
export default class NSIdentity {


  private static _instances: { [fqn: string]: NSIdentity } = {};
  private static _mapBackingField: IdResolver;
  private static get _map(): IdResolver{
    if (this._mapBackingField === void 0) {
      this._mapBackingField = new IdResolver();
    }
    return this._mapBackingField;
  }

  private _ns: Namespace;
  private _name: string;
  private _fqn: string;

  /**
   * Generate an instance from Full qualified name.
   * @param  {string}             fqn [description]
   * @return {NSIdentity}     [description]
   */
  public static fromFQN(fqn: string): NSIdentity;
  public static fromFQN(qn: Namespace, name: string): NSIdentity;
  public static fromFQN(fqn: string | Namespace, name?: string): NSIdentity {
    const hierarchy = NSIdentity._ensureQNTobeArray(fqn, name);
    fqn = hierarchy.join(".");
    const inst = NSIdentity._instances[fqn];
    if (inst) {
      return inst;
    }
    const splitted = fqn.split(".");
    return new NSIdentity(splitted);
  }

  public static guess(...hierarchy: string[]): NSIdentity {
    return NSIdentity._from(hierarchy);
  }

  public static clear(): void {
    NSIdentity._instances = {};
    NSIdentity._mapBackingField = new IdResolver();
  }

  /**
   * return instance if exists.
   * generate and return new instanse if not exist id has same fqn.
   * @param  {string[]}   hierarchy [description]
   * @return {NSIdentity}           [description]
   */
  private static _from(hierarchy: string[]): NSIdentity {
    const fqn = hierarchy.join(".");
    const inst = NSIdentity._instances[fqn];
    if (inst) {
      return inst;
    }

    return NSIdentity.fromFQN(NSIdentity._map.resolve(Namespace.defineByArray(hierarchy)));
  }

  private static _ensureQNTobeArray(arg1: string | string[] | Namespace, name?: string): string[] {
    if (name) {
      return NSIdentity._ensureQNTobeArray((arg1 as Namespace).extend(name));
    }
    if (typeof arg1 === "string") {
      return arg1.split(".");
    }
    if (Array.isArray(arg1)) {
      return arg1;
    }
    return arg1.hierarchy;
  }

  public constructor(fqn: string | string[]);
  public constructor(qn: string[], n: string);
  public constructor(qn: string | string[], n?: string) {
    if (typeof qn === "string") {
      qn = qn.split(".");
    }
    if (n) {
      this._ns = Namespace.defineByArray(qn);
      this._name = n;
    } else {
      this._name = qn[qn.length - 1];
      qn = qn.slice(0, qn.length - 1);
      this._ns = Namespace.defineByArray(qn);

    }

    this._fqn = this.ns.hierarchy.concat([this.name]).join(".");

    NSIdentity._instances[this._fqn] = this;
    NSIdentity._map.add(qn.concat([this._name]));
  }

  /**
   * Namespace of this identity
   * @type {string}
   */
  public get ns(): Namespace {
    return this._ns;
  }

  /**
   * Short name for this identity
   * @type {string}
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Full qualified name of this identity
   * @type {string}
   */
  public get fqn(): string {
    return this._fqn;
  }

  public isMatch(name: string): boolean {
    if (Ensure.checkFQNString(name)) {
      return this._fqn === Ensure.tobeFQN(name);
    } else {
      let resolver = new IdResolver();
      resolver.add(this);
      let get = resolver.get(name);
      return get.length === 1;
    }
  }

  public toString(): string {
    return this.fqn;
  }
}
