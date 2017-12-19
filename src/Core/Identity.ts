import Ensure from "../Tool/Ensure";
import IdResolver from "../Tool/IdResolver";
import Namespace from "./Namespace";

/**
 * The class to identity with XML namespace feature.
 */
export default class Identity {

  private static _instances: { [fqn: string]: Identity } = {};
  private static _mapBackingField: IdResolver;

  /**
   * Generate an instance from Full qualified name.
   * @param  {string}             fqn [description]
   * @return {Identity}     [description]
   */
  public static fromFQN(fqn: string): Identity {
    const inst = Identity._instances[fqn];
    if (inst) {
      return inst;
    }
    const splitted = fqn.split(".");
    return new Identity(splitted);
  }

  /**
   * return instance if exists.
   * generate and return new instanse if not exist id has same fqn.
   * throw error if hierarchy is ambiguous or not found.
   * @param hierarchy
   */
  public static guess(...hierarchy: string[]): Identity {
    return Identity._guess(hierarchy);
  }

  /**
   * clear context.
   */
  public static clear(): void {
    Identity._instances = {};
    Identity._mapBackingField = new IdResolver();
  }

  private static get _map(): IdResolver {
    if (this._mapBackingField === undefined) {
      this._mapBackingField = new IdResolver();
    }
    return this._mapBackingField;
  }

  private static _guess(hierarchy: string[]): Identity {
    const fqn = hierarchy.join(".");
    const inst = Identity._instances[fqn];
    if (inst) {
      return inst;
    }

    return Identity.fromFQN(Identity._map.resolve(Namespace.defineByArray(hierarchy)));
  }

  private _ns: Namespace;
  private _name: string;
  private _fqn: string;

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

    Identity._instances[this._fqn] = this;
    Identity._map.add(qn.concat([this._name]));
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

  /**
   * whether this identity fqn is match provided name.
   * TODO: put url to document here
   * @param name this
   */
  public isMatch(name: string): boolean {
    if (Ensure.checkFQNString(name)) {
      return this._fqn === Ensure.tobeFQN(name);
    } else {
      const resolver = new IdResolver();
      resolver.add(this);
      const get = resolver.get(name);
      return get.length === 1;
    }
  }

  /**
   * return fqn
   */
  public toString(): string {
    return this.fqn;
  }
}
