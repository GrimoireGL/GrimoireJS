import NSIdentity from "./NSIdentity";
class NSDictionary<V> {

  private _nameObjectMap: Map<string, Map<string, V>> = new Map<string, Map<string, V>>();

  private _fqnObjectMap: Map<string, V> = new Map<string, V>();

  public set(key: NSIdentity, value: V): void {
    let namedChildMap: Map<string, V>;
    if (this._nameObjectMap.has(key.name)) {
      namedChildMap = this._nameObjectMap.get(key.name);
    } else {
      namedChildMap = new Map<string, V>();
      this._nameObjectMap.set(key.name, namedChildMap);
    }
    namedChildMap.set(key.fqn, value);
    this._fqnObjectMap.set(key.fqn, value);
  }

  public delete(key: NSIdentity): void {
    if (this._fqnObjectMap.has(key.fqn)) {
      const theMap = this._nameObjectMap.get(key.name);
      if (theMap.size === 1) {
        this._nameObjectMap.delete(key.name);
      } else {
        theMap.delete(key.fqn);
      }
      this._fqnObjectMap.delete(key.fqn);
    }
  }

  public get(name: string): V;
  public get(ns: string, name: string): V;
  public get(nsi: NSIdentity): V;
  public get(element: Element): V;
  public get(attribute: Attr): V;
  public get(arg1: string | Element | NSIdentity | Attr, name?: string): V {
    if (typeof arg1 === "string") {
      if (name) {
        return this.get(new NSIdentity(arg1 as string, name));
      } else {
        const namedMap = this._nameObjectMap.get((arg1 as string));
        if (!namedMap) {
          return null;
        }
        if (namedMap.size === 1) {
          const itr = namedMap.values();
          return itr.next().value;
        } else {
          throw new Error(`Specified tag name ${arg1} is ambigious to identify.`);
        }
      }
    } else {
      if (arg1 instanceof NSIdentity) {
        return this.fromFQN((arg1 as NSIdentity).fqn);
      } else {
        if (arg1.prefix) {
          return this.get(new NSIdentity(arg1.namespaceURI, arg1.localName));
        } else {
          if (arg1.namespaceURI && this._fqnObjectMap.has(arg1.localName + "|" + arg1.namespaceURI)) {
            return this.get(new NSIdentity(arg1.namespaceURI, arg1.localName));
          }
          if ((arg1 as Attr) && (arg1 as Attr).ownerElement && (arg1 as Attr).ownerElement.namespaceURI && this._fqnObjectMap.has(arg1.localName + "|" + (arg1 as Attr).ownerElement.namespaceURI)) {
            return this.get(new NSIdentity((arg1 as Attr).ownerElement.namespaceURI, arg1.localName));
          }
          return this.get(arg1.localName);
        }
      }
    }
  }

  public fromFQN(fqn: string): V {
    return this._fqnObjectMap.get(fqn);
  }

  public isAmbigious(name: string): boolean {
    return this._nameObjectMap.get(name).size > 1;
  }

  public has(name: string): boolean {
    return this._nameObjectMap.has(name);
  }

  public pushDictionary(dict: NSDictionary<V>): NSDictionary<V> {
    dict._fqnObjectMap.forEach((value, keyFQN) => {
      const id = NSIdentity.fromFQN(keyFQN);
      this.set(id, value);
    });
    return this;
  }

  public toArray(): V[] {
    const ret: V[] = [];
    this._fqnObjectMap.forEach((value) => {
      ret.push(value);
    });
    return ret;
  }
  public clone(): NSDictionary<V> {
    const dict = new NSDictionary<V>();
    return dict.pushDictionary(this);
  }
  public forEach(callback: (value: V, fqn: string) => void): NSDictionary<V> {
    this._fqnObjectMap.forEach((val, key) => {
      callback(val, key);
    });
    return this;
  }
  public map<T>(callback: ((value: V, fqn: string) => T)): NSDictionary<T> {
    const ret = new NSDictionary<T>();
    this._fqnObjectMap.forEach((val, fqn) => {
      const id = NSIdentity.fromFQN(fqn);
      ret.set(id, callback(val, fqn));
    });
    return ret;
  }
  public clear(): void {
    this._nameObjectMap.clear();
    this._fqnObjectMap.clear();
  }
}

export default NSDictionary;
