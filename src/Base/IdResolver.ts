import Namespace from "./Namespace";
import NSIdentity from "./NSIdentity";


/**
 * 名前空間階層から、コンテキストに応じて曖昧性解消する。
 * @return {[type]} [description]
 */
export default class IdResolver {
  private _nameMap: { [name: string]: IdResolver } = {};
  private _FQNSet: Set<string> = new Set();
  private _isTerminal = false;

  public get count(): number {
    return this._FQNSet.size;
  }

  /**
   * add id to resolver context.
   * @param  {NSIdentity} id [description]
   * @return {boolean}       true if succcess adding.
   */
  public add(id: string[] | NSIdentity): boolean {
    if (!id) {
      throw new Error(`Argument ns is null or undefined.`);
    }
    if (id instanceof NSIdentity) {
      id = id.ns.hierarchy.concat([id.name]);
    }
    if (id.length === 0) {
      return false;
    }
    return this._add(id);
  }

  /**
   * 可能性のあるIDすべて取得
   * @param  {string | string[]}    name [description]
   * @return {string[]}    [description]
   */
  public get(ns: Namespace): string[] {
    const name = ns.hierarchy;
    let current_name = name[name.length - 1];
    if (!this._nameMap[current_name]) {
      return [];
    }
    let pathes = this._nameMap[current_name]._get(name.slice(0, name.length - 1));

    const res = [];

    for (let i = 0; i < pathes.length; i++) {
      let a = pathes[i];
      a.push(current_name);
      res.push(a.join("."));
    }
    return res;
  }
  public resolve(name: Namespace): string {
    let pathes = this.get(name);
    if (pathes.length === 0) {
      throw new Error(`${name} is not found in this context.`);
    }
    if (pathes.length > 1) {
      throw new Error(`${name} is ambiguous in this context. [${pathes.join(", ")}]`);
    }
    return pathes[0];
  }
  public has(name: string): boolean {
    return !!this._nameMap[name];
  }
  public remove(name: NSIdentity): void {
    const fqn = name.fqn.split(".");
    this._remove(fqn);
  }
  public foreach(callback: (fqn: string) => void): void {
    this._FQNSet.forEach(callback);
  }

  private _remove(name: string[]): void {
    if (name.length === 1) {
      this._nameMap[name[0]]._isTerminal = false;
    } else {
      const next = this._nameMap[name[name.length - 1]];
      next._remove(name.slice(0, name.length - 1));
    }
  }

  private _get(name: string[]): string[][] {
    if (name.length === 0) {
      if (this.count === 0) {
        return [[]];
      }
      const res: string[][] = [];
      for (let key in this._nameMap) {
        let match = this._nameMap[key]._get([])!;
        for (let i = 0; i < match.length; i++) {
          let m = match[i];
          m.push(key);
          res.push(m);
        }
      }
      if (this._isTerminal) {
        res.push([]);
      }
      return res;
    }
    let current_name = name[name.length - 1];
    const res: string[][] = [];
    for (let key in this._nameMap) {
      let match = key === current_name ? this._nameMap[key]._get(name.slice(0, name.length - 1)) : this._nameMap[key]._get(name);
      if (match.length !== 0) {
        for (let i = 0; i < match.length; i++) {
          let m = match[i];
          m.push(key);
          res.push(m);
        }
      }
    }
    return res;
  }

  /**
   * nameはドットをフラット化済。nameの長さは0ではない。重複があればfalse新規ならtrueを返す。
   * @param  {string[]} name [description]
   * @return {boolean}       [description]
   */
  private _add(id: string[]): boolean {
    const fqn = id.join(".");
    if (this._FQNSet.has(fqn)) {
      return false;
    }
    this._FQNSet.add(fqn);
    if (!this._nameMap[id[id.length - 1]]) {
      this._nameMap[id[id.length - 1]] = new IdResolver();
    }
    const next = id.slice(0, id.length - 1);
    if (next.length === 0) {
      this._nameMap[id[id.length - 1]]._isTerminal = true;
    } else {
      this._nameMap[id[id.length - 1]].add(next);
    }
    return true;
  }
}
