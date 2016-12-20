import NSIdentity from "./NSIdentity";

type Dict<V> = { [key: string]: V };

class NSDictionary<V> {

  private _nameObjectMap: Dict<{ id: NSIdentity, value: V }[]> = {};

  private _fqnObjectMap: Dict<V> = {};
  private _nameMap: Dict<V> = {}

  public set(key: NSIdentity, value: V): void {
    if (!this._fqnObjectMap[key.fqn]) {//new value
      this._fqnObjectMap[key.fqn] = value;
      let c = this._nameObjectMap[key.name];
      if (c !== void 0) {
        c.push({ id: key, value: value });
      } else {
        this._nameObjectMap[key.name] = [{ id: key, value: value }];
      }
    } else {//overwrite
      this._fqnObjectMap[key.fqn] = value;
      let c = this._nameObjectMap[key.name];
      for (let i = 0; i < c.length; i++) {
        if (c[i].id.fqn == key.fqn) {
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
        if (theMap[i].id.fqn == key.fqn) {
          theMap.splice(i, 1);
          break;
        }
      }
      return true;
    }
    return false;
  }

  public get(name: string): V;
  public get(ns: string, name: string): V;
  public get(nsi: NSIdentity): V;
  public get(element: Element): V;
  public get(attribute: Attr): V;
  public get(arg1: string | Element | NSIdentity | Attr, name?: string): V {
    // if (!arg1) {
    //   throw new Error("NSDictionary.get() can not recieve args null or undefined.");
    // }
    if (typeof arg1 === "string") {
      if (name) {//name and ns.
        return this.fromFQN(arg1.toUpperCase() + "|" + name);
      } else {//name only.
        const namedMap = this._nameObjectMap[arg1];
        if (!namedMap) {
          return null;
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
        if (arg1.prefix) {//element
          return this.get(new NSIdentity(arg1.namespaceURI, arg1.localName));
        } else {//attr
          if (arg1.namespaceURI && this._fqnObjectMap[arg1.localName + "|" + arg1.namespaceURI] !== void 0) {
            return this.get(new NSIdentity(arg1.namespaceURI, arg1.localName));
          }
          if ((arg1 as Attr) && (arg1 as Attr).ownerElement && (arg1 as Attr).ownerElement.namespaceURI && this._fqnObjectMap[arg1.localName + "|" + (arg1 as Attr).ownerElement.namespaceURI] !== void 0) {
            return this.get(new NSIdentity((arg1 as Attr).ownerElement.namespaceURI, arg1.localName));
          }
          return this.get(arg1.localName);
        }
      }
    }
  }

  public fromFQN(fqn: string): V {
    return this._fqnObjectMap[fqn];
  }

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
