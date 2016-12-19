import NSIdentity from "./NSIdentity";

class NSSet {
  private _contentArray: NSIdentity[] = [];

  public static fromArray(array: NSIdentity[]): NSSet {
    const nSet = new NSSet();
    nSet.pushArray(array);
    return nSet;
  }

  public push(item: NSIdentity): NSSet {
    const index = this._contentArray.findIndex(id => id.fqn === item.fqn);
    if (index === -1) {
      this._contentArray.push(item);
    }
    return this;
  }

  public pushArray(item: NSIdentity[]): NSSet {
    item.forEach(v => {
      this.push(v);
    });
    return this;
  }

  public values(): IterableIterator<NSIdentity> {
    return this._contentArray.values();
  }

  public toArray(): NSIdentity[] {
    const ret: NSIdentity[] = [];
    for (let key in this._contentArray) {
      ret.push(this._contentArray[key]);
    }
    return ret;
  }

  public clone(): NSSet {
    const newSet = new NSSet();
    for (let i of this._contentArray) {
      newSet.push(i);
    }
    return newSet;
  }

  public merge(other: NSSet): NSSet {
    for (let elem of other._contentArray) {
      this.push(elem);
    }
    return this;
  }
}

export default NSSet;
