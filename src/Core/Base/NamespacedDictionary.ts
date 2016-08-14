import NamespacedIdentity from "./NamespacedIdentity";
class NamespacedDictionary<V> {

    private _nameObjectMap: Map<string, Map<string, V>> = new Map<string, Map<string, V>>();

    private _fqnObjectMap: Map<string, V> = new Map<string, V>();

    public set(key: NamespacedIdentity, value: V): void {
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

    public delete(key: NamespacedIdentity): void {
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
    public get(nsi: NamespacedIdentity): V;
    public get(element: Element): V;
    public get(attribute: Attr): V;
    public get(arg1: string | Element | NamespacedIdentity | Attr, name?: string): V {
        if (typeof arg1 === "string") {
            if (name) {
                return this.get(new NamespacedIdentity(arg1 as string, name));
            } else {
                const namedMap = this._nameObjectMap.get((arg1 as string).toUpperCase());
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
            if (arg1 instanceof NamespacedIdentity) {
                return this.fromFQN((arg1 as NamespacedIdentity).fqn);
            } else {
                if (arg1.prefix) {
                    return this.get(new NamespacedIdentity(arg1.namespaceURI, arg1.localName));
                } else {
                    if (arg1.namespaceURI && this._fqnObjectMap.has(arg1.localName.toUpperCase() + "|" + arg1.namespaceURI.toUpperCase())) {
                        return this.get(new NamespacedIdentity(arg1.namespaceURI.toUpperCase(), arg1.localName.toUpperCase()));
                    }
                    if ((arg1 as Attr) && (arg1 as Attr).ownerElement && (arg1 as Attr).ownerElement.namespaceURI && this._fqnObjectMap.has(arg1.localName.toUpperCase() + "|" + (arg1 as Attr).ownerElement.namespaceURI.toUpperCase())) {
                        return this.get(new NamespacedIdentity((arg1 as Attr).ownerElement.namespaceURI.toUpperCase(), arg1.localName.toUpperCase()));
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
        return this._nameObjectMap.get(name.toUpperCase()).size > 1;
    }

    public has(name: string): boolean {
        return this._nameObjectMap.has(name);
    }

    public pushDictionary(dict: NamespacedDictionary<V>): NamespacedDictionary<V> {
        dict._fqnObjectMap.forEach((value, keyFQN) => {
            const id = NamespacedIdentity.fromFQN(keyFQN);
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
    public forEach(callback: (value: V, fqn: string) => void): NamespacedDictionary<V> {
        this._fqnObjectMap.forEach((val, key) => {
            callback(val, key);
        });
        return this;
    }
    public map<T>(callback: ((value: V, fqn: string) => T)): NamespacedDictionary<T> {
        const ret = new NamespacedDictionary<T>();
        this._fqnObjectMap.forEach((val, fqn) => {
            const id = NamespacedIdentity.fromFQN(fqn);
            ret.set(id, callback(val, fqn));
        });
        return ret;
    }
    public clear(): void {
      this._nameObjectMap.clear();
      this._fqnObjectMap.clear();
    }
}

export default NamespacedDictionary;