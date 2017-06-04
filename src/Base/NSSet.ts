import NSIdentity from "./NSIdentity";

/**
 * set of NSIdentity
 * @param  {NSIdentity[]} array [description]
 * @return {NSSet}              [description]
 */
export default class NSSet {
  private _content: { [fqn: string]: NSIdentity } = {};

  public static fromArray(array: NSIdentity[]): NSSet {
    const nSet = new NSSet();
    nSet.pushArray(array);
    return nSet;
  }


  constructor(content?: NSIdentity[]) {
    if (content) {
      this.pushArray(content);
    }
  }

  public push(item: NSIdentity): boolean {
    if (!this._content[item.fqn]) {
      this._content[item.fqn] = item;
      return true;
    }
    return false;
  }

  public pushArray(item: NSIdentity[]): NSSet {
    item.forEach(v => {
      this.push(v);
    });
    return this;
  }

  public toArray(): NSIdentity[] {
    const ret: NSIdentity[] = [];
    for (let key in this._content) {
      ret.push(this._content[key]);
    }
    return ret;
  }

  public clone(): NSSet {
    const newSet = new NSSet();
    for (let key in this._content) {
      newSet.push(this._content[key]);
    }
    return newSet;
  }

  public merge(other: NSSet): NSSet {
    this.pushArray(other.toArray());
    return this;
  }

  public forEach(func: (name: NSIdentity) => void): NSSet {
    for (let key in this._content) {
      func(this._content[key]);
    }
    return this;
  }
}
