import Identity from "./Identity";

/**
 * set of NSIdentity
 * @param  {Identity[]} array [description]
 * @return {IdentitySet}              [description]
 */
export default class IdentitySet {

  /**
   * create new set from array
   * @param array
   */
  public static fromArray(array: Identity[]): IdentitySet {
    const nSet = new IdentitySet();
    nSet.pushArray(array);
    return nSet;
  }
  private _content: { [fqn: string]: Identity } = {};

  constructor(content?: Identity[]) {
    if (content) {
      this.pushArray(content);
    }
  }

  /**
   * add new identity to this set.
   * @param item
   * @return success or not
   */
  public push(item: Identity): boolean {
    if (!this._content[item.fqn]) {
      this._content[item.fqn] = item;
      return true;
    }
    return false;
  }

  /**
   * add new identities to this set
   * @param item
   */
  public pushArray(item: Identity[]): IdentitySet {
    item.forEach(v => {
      this.push(v);
    });
    return this;
  }

  /**
   * convert to array
   */
  public toArray(): Identity[] {
    const ret: Identity[] = [];
    for (const key in this._content) {
      ret.push(this._content[key]);
    }
    return ret;
  }

  /**
   * create clone set.
   */
  public clone(): IdentitySet {
    const newSet = new IdentitySet();
    for (const key in this._content) {
      newSet.push(this._content[key]);
    }
    return newSet;
  }

  /**
   * add all contents of other set to this set.
   * @param other
   */
  public merge(other: IdentitySet): IdentitySet {
    this.pushArray(other.toArray());
    return this;
  }

  /**
   * call function foreach identity contained this set.
   * @param func
   */
  public forEach(func: (name: Identity) => void): IdentitySet {
    for (const key in this._content) {
      func(this._content[key]);
    }
    return this;
  }
}
