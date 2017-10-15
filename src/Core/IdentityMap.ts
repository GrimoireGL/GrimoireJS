import Namespace from "../Core/Namespace";
import Ensure from "../Tools/Ensure";
import IdResolver from "../Tools/IdResolver";
import { Name, Nullable, Undef } from "../Tools/Types";
import Identity from "./Identity";

type Dict<V> = { [key: string]: V };

/**
 * map identity to value.
 */
export default class IdentityMap<V> {

  private _fqnObjectMap: Dict<V> = {};
  private _idResolver: IdResolver = new IdResolver();

  /**
   * set value for provided key.
   * @param key
   * @param value
   */
  public set(key: Identity, value: V): void {
    this._fqnObjectMap[key.fqn] = value;
    this._idResolver.add(key);
  }

  /**
   * delete provided key value if exists.
   * @param key
   * @return success or not
   */
  public delete(key: Identity): boolean {
    if (this._fqnObjectMap[key.fqn] !== undefined) {
      delete this._fqnObjectMap[key.fqn];
      this._idResolver.remove(key);
      return true;
    }
    return false;
  }

  /**
   * get value by key.
   * throw error if provided key is null or udefined.
   * return null if key is not exists.
   * @param name
   */
  public get<T extends V = V>(name: Name): Nullable<T>;
  public get<T extends V = V>(element: Element): Nullable<T>;
  public get<T extends V = V>(attribute: Attr): Nullable<T>;
  public get<T extends V = V>(arg1: string | Element | Identity | Attr): Nullable<T> {
    if (!arg1) {
      throw new Error("NSDictionary.get() can not recieve args null or undefined.");
    }
    if (typeof arg1 === "string") {
      const fqn = Ensure.tobeFQN(arg1);
      if (fqn) {
        return this._fqnObjectMap[fqn] as T;
      }
      const name = arg1.split(".");
      const res = this._idResolver.get(Namespace.defineByArray(name));
      // const namedMap = this._nameObjectMap[arg1];
      if (res.length === 0) {
        return null; // not exist.
      }
      if (res.length === 1) {
        return this._fqnObjectMap[res[0]] as T;
      } else {
        throw new Error(`Specified tag name ${arg1} is ambiguous to identify.`);
      }

    } else {
      if (arg1 instanceof Identity) {
        return this._fqnObjectMap[arg1.fqn] as T;
      } else {
        if (arg1.namespaceURI) {
          return this.get(`${arg1.namespaceURI}.${arg1.localName!}`);
        }
        return this.get(arg1.localName!);
      }
    }
  }

  /**
   * Check if name has possibility of multiple values.
   * @param  {string}  name [description]
   * @return {boolean}      Whether the name has multiple values.
   */
  public isAmbiguous(name: string): boolean {
    return this._idResolver.get(Namespace.defineByArray(name.split("."))).length > 1;
  }

  /**
   * check key is exists in this map.
   * @param name
   */
  public has(name: string): boolean {
    return this._idResolver.get(Namespace.defineByArray(name.split("."))).length !== 0;
  }

  /**
   * add all value to this map.
   * @param map
   */
  public pushDictionary(map: IdentityMap<V>): IdentityMap<V> {
    map.forEach((value, keyFQN) => {
      const id = Identity.fromFQN(keyFQN);
      this.set(id, value);
    });
    return this;
  }

  /**
   * return value if exists key that match provided name.
   * throw error if multiple key match provided name.
   * return undefined if no key matched.
   * @param name
   */
  public hasMatchingValue(name: Identity): Undef<V> {
    const resolver = new IdResolver();
    resolver.add(name);
    let match: string | undefined;
    for (const key in this._fqnObjectMap) {
      const v = resolver.get(Namespace.defineByArray(key.split(".")));
      if (v.length === 1) {
        if (match === undefined) {
          match = key;
        } else {
          throw new Error(`matching attribute is ambiguous. It has following possibilities ${match} ${key}`);
        }
      }
    }
    if (match) {
      return this._fqnObjectMap[match];
    }
    return undefined;
  }

  /**
   * convert to array.
   */
  public toArray(): V[] {
    const ret: V[] = [];
    Object.keys(this._fqnObjectMap).forEach(key => {
      ret.push(this._fqnObjectMap[key]);
    });
    return ret;
  }

  /**
   * create clone IdentityMap.
   */
  public clone(): IdentityMap<V> {
    const dict = new IdentityMap<V>();
    return dict.pushDictionary(this);
  }

  /**
   * call function for each key value pair.
   * @param callback
   */
  public forEach(callback: (value: V, fqn: string) => void): IdentityMap<V> {
    Object.keys(this._fqnObjectMap).forEach(key => {
      callback(this._fqnObjectMap[key], key);
    });
    return this;
  }

  /**
   * create new IdentityMap with mapped values.
   * @param callback
   */
  public map<T>(callback: ((value: V, fqn: string) => T)): IdentityMap<T> {
    const ret = new IdentityMap<T>();
    this.forEach((val, fqn) => {
      const id = Identity.fromFQN(fqn);
      ret.set(id, callback(val, fqn));
    });
    return ret;
  }

  /**
   * clear all value.
   */
  public clear(): void {
    this._fqnObjectMap = {};
    this._idResolver = new IdResolver();
  }
}
