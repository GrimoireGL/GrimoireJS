import NSIdentity from "./NSIdentity";
import {Name, Nullable} from "./Types";

type Dict<V> = { [key: string]: V };

class NSDictionary<V> {

  private _nameObjectMap: Dict<{ id: NSIdentity, value: V }[]> = {};

  private _fqnObjectMap: Dict<V> = {};

  public set(key: NSIdentity, value: V): void {
    if (!this._fqnObjectMap[key.fqn]) {// new value
      this._fqnObjectMap[key.fqn] = value;
      let c = this._nameObjectMap[key.name];
      if (c !== void 0) {
        c.push({ id: key, value: value });
      } else {
        this._nameObjectMap[key.name] = [{ id: key, value: value }];
      }
    } else {// overwrite
      this._fqnObjectMap[key.fqn] = value;
      let c = this._nameObjectMap[key.name];
      for (let i = 0; i < c.length; i++) {
        if (c[i].id.fqn === key.fqn) {
          c[i] = { id: key, value: value };
          break;
        }
      }
    }
  }

  public delete(key: NSIdentity): boolean {
    if (this._fqnObjectMap[key.fqn] !== void 0) {
      delete this._fqnObjectMap[key.fqn];
      const theMap = this._nameObjectMap[key.name];
      for (let i = 0; i < theMap.length; i++) {
        if (theMap[i].id.fqn === key.fqn) {
          theMap.splice(i, 1);
          break;
        }
      }
      if (theMap.length === 0) {
        delete this._nameObjectMap[key.name];
      }
      return true;
    }
    return false;
  }

  public get(name: Name): V;
  public get(ns: string, name: string): V;
  public get(element: Element): V;
  public get(attribute: Attr): V;
  public get(arg1: string | Element | NSIdentity | Attr, name?: string): Nullable<V> {
    if (!arg1) {
      throw new Error("NSDictionary.get() can not recieve args null or undefined.");
    }
    if (typeof arg1 === "string") {
      if (name) {// name and ns.
        return this.fromFQN(name + "|" + arg1.toLowerCase());
      } else {// name only.
        const namedMap = this._nameObjectMap[arg1];
        if (!namedMap) {
          return null; // not exist.
        }
        if (namedMap.length === 1) {
          return namedMap[0].value;
        } else {
          throw new Error(`Specified tag name ${arg1} is ambigious to identify.`);
        }
      }
    } else {
      if (arg1 instanceof NSIdentity) {
        return this.fromFQN(arg1.fqn);
      } else {
        if (arg1.prefix) {// element
          return this.get(NSIdentity.from(arg1.namespaceURI!, arg1.localName!));
        } else {// attr
          arg1 = arg1 as Attr;
          if (arg1.namespaceURI && this._fqnObjectMap[arg1.localName + "|" + arg1.namespaceURI] !== void 0) {
            return this.get(NSIdentity.from(arg1.namespaceURI, arg1.localName!));
          }
          if (arg1.ownerElement && arg1.ownerElement.namespaceURI && this._fqnObjectMap[arg1.localName + "|" + arg1.ownerElement.namespaceURI] !== void 0) {
            return this.get(NSIdentity.from(arg1.ownerElement.namespaceURI!, arg1.localName!));
          }
          return this.get(arg1.localName!);
        }
      }
    }
  }

  /**
   * get value from fqn.
   * return undefined if key not found.
   * @param  {string} fqn key fqn
   * @return {V}          [description]
   */
  public fromFQN(fqn: string): V {
    return this._fqnObjectMap[fqn];
  }

  /**
   * Check if name has possibility of multiple values.
   * @param  {string}  name [description]
   * @return {boolean}      Whether the name has multiple values.
   */
  public isAmbigious(name: string): boolean {
    return this._nameObjectMap[name].length > 1;
  }

  public has(name: string): boolean {
    return this._nameObjectMap[name] !== void 0;
  }

  public pushDictionary(dict: NSDictionary<V>): NSDictionary<V> {
    dict.forEach((value, keyFQN) => {
      const id = NSIdentity.fromFQN(keyFQN);
      this.set(id, value);
    });
    return this;
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
    this._nameObjectMap = {};
    this._fqnObjectMap = {};
  }
}

export default NSDictionary;
