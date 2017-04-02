import Constants from "./Constants";
/**
 * The class to identity with XML namespace feature.
 */
class NSIdentity {

  private static _instances: { [fqn: string]: NSIdentity } = {};
  private static _map: { [name: string]: NSIdentity[] } = {};

  private _ns: string;
  private _name: string;
  private _fqn: string;

  /**
   * Namespace of this identity
   * @type {string}
   */
  public get ns(): string {
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
   * Generate an instance from Full qualified name.
   * @param  {string}             fqn [description]
   * @return {NSIdentity}     [description]
   */
  public static fromFQN(fqn: string): NSIdentity {
    const inst = NSIdentity._instances[fqn];
    if (inst) {
      return inst;
    }
    const splitted = fqn.split("|");
    if (splitted.length !== 2) {
      throw new Error("Invalid fqn was given");
    }
    return new NSIdentity(splitted[1], splitted[0]);
  }


  /**
   * デフォルト名前空間でID作成
   * @param  {string}     name [description]
   * @return {NSIdentity}      [description]
   */
  public static createOnDefaultNS(name: string): NSIdentity {
    return NSIdentity.from(Constants.defaultNamespace, name);
  }

  public static from(name: string): NSIdentity;
  public static from(ns: string, name: string): NSIdentity;
  public static from(arg1: string, name?: string): NSIdentity {
    if (name) {
      const fqn = name + "|" + arg1.toUpperCase();
      const inst = NSIdentity._instances[fqn];
      if (inst) {
        return inst;
      }
      return new NSIdentity(arg1, name);
    } else {
      const list = NSIdentity._map[arg1];
      if (!list) {
        return new NSIdentity(Constants.defaultNamespace, arg1);
      }
      if (list.length === 1) {
        return list[0];
      }
      throw new Error(`name ${arg1} is ambiguous in NSIdentity.${list} exists.`);
    }
  }

  public static clear(): void {
    NSIdentity._instances = {};
    NSIdentity._map = {};
  }


  /**
   * Make sure given name is valid for using in identity.
   * | is prohibited for using in name or namespace.
   * . is prohibited for using in name.
   * All lowercase alphabet will be transformed into uppercase.
   * @param  {string} name        [A name to verify]
   * @param  {[type]} noDot=false [Ensure not using dot or not]
   * @return {string}             [Valid name]
   */
  private static _ensureValidIdentity(name: string, noDot = false): string {
    if (name == null) {
      throw new Error("Specified name was null or undefined");
    }
    if (name.indexOf("|") > -1) {
      throw new Error("Namespace and identity cannnot contain | ");
    }
    if (noDot && name.indexOf(".") > -1) {
      throw new Error("identity cannnot contain .");
    }
    return name;
  }


  public toString(): string {
    return this.fqn;
  }

  private constructor(ns: string, name: string) {
    this._ns = ns.toUpperCase();
    this._name = name;

    // Ensure all of the characters are uppercase
    this._name = NSIdentity._ensureValidIdentity(this.name, true);
    this._ns = NSIdentity._ensureValidIdentity(this.ns);
    this._fqn = this.name + "|" + this.ns;
    NSIdentity._instances[this._fqn] = this;
    if (!NSIdentity._map[this.name]) {
      NSIdentity._map[this.name] = [this];
    } else {
      NSIdentity._map[this.name].push(this);
    }
  }
}

export default NSIdentity;
