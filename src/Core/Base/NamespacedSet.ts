import NamespacedIdentity from "./NamespacedIdentity";

class NamespacedSet {
    /**
     * The map to containing all values managed by fqn.
     * @type {Map<string, V>}
     */
    private _fqnObjectMap: Map<string, NamespacedIdentity> = new Map<string, NamespacedIdentity>();

    public push(item: NamespacedIdentity): void {
        this._fqnObjectMap.set(item.fqn, item);
    }

    public pushArray(item: NamespacedIdentity[]): void {
        item.forEach(v => {
            this.push(v);
        });
    }

    public values(): IterableIterator<NamespacedIdentity> {
        return this._fqnObjectMap.values();
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
