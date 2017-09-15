import NSIdentity from "../Core/NSIdentity";
import IdResolver from "./IdResolver";
import Namespace from "../Core/Namespace";
import Ensure from "./Ensure";
import {Name, Nullable, Undef} from "./Types";

type Dict<V> = { [key: string]: V };

export default class NSDictionary<V> {

  private _fqnObjectMap: Dict<V> = {};
  private _idResolver: IdResolver = new IdResolver();

  public set(key: NSIdentity, value: V): void {
    this._fqnObjectMap[key.fqn] = value;
    this._idResolver.add(key);
  }

  public delete(key: NSIdentity): boolean {
    if (this._fqnObjectMap[key.fqn] !== void 0) {
      delete this._fqnObjectMap[key.fqn];
      this._idResolver.remove(key);
      return true;
    }
    return false;
  }

  public get(name: Name): V;
  public get(element: Element): V;
  public get(attribute: Attr): V;
  public get(arg1: string | Element | NSIdentity | Attr): Nullable<V> {
    if (!arg1) {
      throw new Error("NSDictionary.get() can not recieve args null or undefined.");
    }
    if (typeof arg1 === "string") {
      const fqn = Ensure.tobeFQN(arg1);
      if (fqn) {
        return this._fqnObjectMap[fqn];
      }
      const name = arg1.split(".");
      const res = this._idResolver.get(Namespace.defineByArray(name));
      // const namedMap = this._nameObjectMap[arg1];
      if (res.length === 0) {
        return null; // not exist.
      }
      if (res.length === 1) {
        return this._fqnObjectMap[res[0]];
      } else {
        throw new Error(`Specified tag name ${arg1} is ambiguous to identify.`);
      }

    } else {
      if (arg1 instanceof NSIdentity) {
        return this._fqnObjectMap[arg1.fqn];
      } else {
        if (arg1.namespaceURI) {
          return this.get(arg1.namespaceURI + "." + arg1.localName!);
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

  public has(name: string): boolean {
    return this._idResolver.get(Namespace.defineByArray(name.split("."))).length !== 0;
  }

  public pushDictionary(dict: NSDictionary<V>): NSDictionary<V> {
    dict.forEach((value, keyFQN) => {
      const id = NSIdentity.fromFQN(keyFQN);
      this.set(id, value);
    });
    return this;
  }

  public hasMatchingValue(name: NSIdentity): Undef<V> {
    const resolver = new IdResolver();
    resolver.add(name);
    let match: string | undefined = void 0;
    for (let key in this._fqnObjectMap) {
      let v = resolver.get(Namespace.defineByArray(key.split(".")));
      if (v.length === 1) {
        if (match === void 0) {
          match = key;
        } else {
          throw new Error(`matching attribute is ambiguous. It has following possibilities ${match} ${key}`);
        }
      }
    }
    if (match) {
      return this._fqnObjectMap[match];
    }
    return void 0;
  }

  public toArray(): V[] {
    const ret: V[] = [];
    Object.keys(this._fqnObjectMap).forEach(key => {
      ret.push(this._fqnObjectMap[key]);
    });
    return ret;
  }
  public clone(): NSDictionary<V> {
    const dict = new NSDictionary<V>();
    return dict.pushDictionary(this);
  }
  public forEach(callback: (value: V, fqn: string) => void): NSDictionary<V> {
    Object.keys(this._fqnObjectMap).forEach(key => {
      callback(this._fqnObjectMap[key], key);
    });
    return this;
  }
  public map<T>(callback: ((value: V, fqn: string) => T)): NSDictionary<T> {
    const ret = new NSDictionary<T>();
    this.forEach((val, fqn) => {
      const id = NSIdentity.fromFQN(fqn);
      ret.set(id, callback(val, fqn));
    });
    return ret;
  }
  public clear(): void {
    this._fqnObjectMap = {};
    this._idResolver = new IdResolver();
  }
}
