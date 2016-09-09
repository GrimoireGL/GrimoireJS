import NSIdentity from "./NSIdentity";

class NSSet {
    /**
     * The map to containing all values managed by fqn.
     * @type {Map<string, V>}
     */
    private _fqnObjectMap: Map<string, NSIdentity> = new Map<string, NSIdentity>();

    public static fromArray(array: NSIdentity[]): NSSet {
        const nSet = new NSSet();
        nSet.pushArray(array);
        return nSet;
    }

    public push(item: NSIdentity): NSSet {
        this._fqnObjectMap.set(item.fqn, item);
        return this;
    }

    public pushArray(item: NSIdentity[]): NSSet {
        item.forEach(v => {
            this.push(v);
        });
        return this;
    }

    public values(): IterableIterator<NSIdentity> {
        return this._fqnObjectMap.values();
    }

    public toArray(): NSIdentity[] {
        const ret: NSIdentity[] = [];
        const values = this.values();
        for (let val of values) {
            ret.push(val);
        }
        return ret;
    }

    public clone(): NSSet {
        const newSet = new NSSet();
        const values = this.values();
        for (let i of values) {
            newSet.push(i);
        }
        return newSet;
    }

    public merge(other: NSSet): NSSet {
        const values = other.values();
        for (let elem of values) {
            this.push(elem);
        }
        return this;
    }
}

export default NSSet;
