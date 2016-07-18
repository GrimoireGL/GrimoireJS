import NamespacedIdentity from "./NamespacedIdentity";

class NamespacedSet {
    /**
     * The map to containing all values managed by fqn.
     * @type {Map<string, V>}
     */
    private _fqnObjectMap: Map<string, NamespacedIdentity> = new Map<string, NamespacedIdentity>();

    public static fromArray(array: NamespacedIdentity[]): NamespacedSet {
        const nSet = new NamespacedSet();
        nSet.pushArray(array);
        return nSet;
    }

    public push(item: NamespacedIdentity): NamespacedSet {
        this._fqnObjectMap.set(item.fqn, item);
        return this;
    }

    public pushArray(item: NamespacedIdentity[]): NamespacedSet {
        item.forEach(v => {
            this.push(v);
        });
        return this;
    }

    public values(): IterableIterator<NamespacedIdentity> {
        return this._fqnObjectMap.values();
    }

    public toArray(): NamespacedIdentity[] {
        const ret: NamespacedIdentity[] = [];
        const values = this.values();
        for (let val of values) {
            ret.push(val);
        }
        return ret;
    }

    public clone(): NamespacedSet {
        const newSet = new NamespacedSet();
        const values = this.values();
        for (let i of values) {
            newSet.push(i);
        }
        return newSet;
    }

    public merge(other): NamespacedSet {
        const values = other.values();
        for (let elem of values) {
            this.push(elem);
        }
        return this;
    }
}

export default NamespacedSet;
