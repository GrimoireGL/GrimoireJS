import Identity from "./Identity";

/**
 * set of NSIdentity
 * @param  {Identity[]} array [description]
 * @return {IdentitySet}              [description]
 */
export default class IdentitySet {
  private _content: { [fqn: string]: Identity } = {};

  public static fromArray(array: Identity[]): IdentitySet {
    const nSet = new IdentitySet();
    nSet.pushArray(array);
    return nSet;
  }


  constructor(content?: Identity[]) {
    if (content) {
      this.pushArray(content);
    }
  }

  public push(item: Identity): boolean {
    if (!this._content[item.fqn]) {
      this._content[item.fqn] = item;
      return true;
    }
    return false;
  }

  public pushArray(item: Identity[]): IdentitySet {
    item.forEach(v => {
      this.push(v);
    });
    return this;
  }

  public toArray(): Identity[] {
    const ret: Identity[] = [];
    for (let key in this._content) {
      ret.push(this._content[key]);
    }
    return ret;
  }

  public clone(): IdentitySet {
    const newSet = new IdentitySet();
    for (let key in this._content) {
      newSet.push(this._content[key]);
    }
    return newSet;
  }

  public merge(other: IdentitySet): IdentitySet {
    this.pushArray(other.toArray());
    return this;
  }

  public forEach(func: (name: Identity) => void): IdentitySet {
    for (let key in this._content) {
      func(this._content[key]);
    }
    return this;
  }
}
