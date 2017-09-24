import Attribute from "../Core/Attribute";
import Ensure from "../Tools/Ensure";
import IdResolver from "../Tools/IdResolver";
import { Name, Undef } from "../Tools/Types";
import Utility from "../Tools/Utility";
import Namespace from "./Namespace";
import NSIdentity from "./NSIdentity";

type NameValPair<T> = { fqn: string, val: T };


class AttributeBuffer<T> {

  private _fqnList: NameValPair<T>[] = [];

  public add(fqn: string, val: T) {
    for (let i = 0; i < this._fqnList.length; i++) {
      const c = this._fqnList[i];
      if (c.fqn === fqn) {
        c.val = val;
        this._fqnList.splice(i, 1);
        this._fqnList.push(c);
        return;
      }
    }
    const obj = { fqn, val };
    this._fqnList.push(obj);
  }

  public resolve(fqn: string, remove: boolean): Undef<T> {
    const guess = this.guess(fqn, remove);
    return guess.length === 0 ? void 0 : guess[guess.length - 1];
  }

  /**
   * get list of value that matchs given fqn.
   * @param  {string}         fqn          [description]
   * @param  {[type]}         remove=false to remove match buffers.
   * @return {NameValPair<T>}              [description]
   */
  public guess(fqn: string, remove: boolean): T[] {
    const resolver = new IdResolver();
    resolver.add(fqn.split("."));
    const ret: T[] = [];
    for (let i = 0; i < this._fqnList.length; i++) {
      const name = this._fqnList[i].fqn;
      const r = resolver.get(name);
      if (r.length > 0) {
        ret.push(this._fqnList[i].val);
        if (remove) {
          this._fqnList.splice(i, 1);
          i--;
        }
      }
    }
    return ret;
  }
}

type observer = (newValue: any, oldValue: any, attr: Attribute) => void;


/**
 * internal use!
 * @return {[type]} [description]
 */
export default class AttributeManager {
  private _attributesFQNMap: { [fqn: string]: Attribute[] } = {};
  private _idResolver: IdResolver = new IdResolver();
  private _attrBuffer: AttributeBuffer<any> = new AttributeBuffer<any>();
  private _watchBuffer: AttributeBuffer<observer> = new AttributeBuffer<observer>();

  public constructor(public tag: string) { }

  public addAttribute(attr: Attribute): Attribute {
    const fqn = attr.name.fqn;
    if (this._idResolver.has(fqn)) { // already exists
      Utility.w(`attribute ${attr.name} is already exist in ${this.tag}`);
    }
    if (this._attributesFQNMap[fqn] === void 0) {
      this._attributesFQNMap[fqn] = [];
    }
    this._attributesFQNMap[fqn].push(attr);
    this._idResolver.add(attr.name);

    // check buffer value.
    const attrBuf = this._attrBuffer.resolve(attr.name.fqn, true);
    if (attrBuf !== void 0) {
      attr.Value = attrBuf;
    }

    const watchBuf = this._watchBuffer.guess(attr.name.fqn, true);
    for (let i = 0; i < watchBuf.length; i++) {
      attr.watch(watchBuf[i], true);
    }
    return attr;
  }

  public watch(attrName: Name, watcher: ((newValue: any, oldValue: any, attr: Attribute) => void), immediate = false) {
    const fqn = Ensure.tobeFQN(attrName);
    if (fqn) {
      const attrs = this._attributesFQNMap[fqn];
      if (attrs === void 0 || attrs.length === 0) {
        this._watchBuffer.add(fqn, watcher);
        return;
      }
      for (let i = 0; i < attrs.length; i++) {
        attrs[i].watch(watcher, immediate);
      }
    } else {
      attrName = attrName as string;
      let res = this._idResolver.get(Namespace.defineByArray(attrName.split(".")));
      if (res.length === 0) {
        this._watchBuffer.add(attrName, watcher);
        return;
      }
      if (res.length > 1) {
        throw new Error(`attribute ${attrName} is ambiguous`);
      }
      for (let i = 0; i < this._attributesFQNMap[res[0]].length; i++) {
        this._attributesFQNMap[res[0]][i].watch(watcher, immediate);
      }
    }
  }

  public setAttribute(attrFQN: string, value: any): void {
    const attrs = this._attributesFQNMap[attrFQN];
    if (attrs === void 0 || attrs.length === 0) {
      this._attrBuffer.add(attrFQN, value);
      return;
    }
    for (let i = 0; i < attrs.length; i++) {
      attrs[i].Value = value;
    }
  }

  /**
   * 文字列指定は曖昧性解消する。
   * 曖昧はエラー。存在しないのはエラー。
   * NSIdentityはfqnで。
   * 指定されたFQNの属性が複数の場合エラー。
   * @param  {Name}      attrName [description]
   * @return {Attribute}          [description]
   */
  public getAttributeRaw(attrName: Name): Attribute {
    const fqn = Ensure.tobeFQN(attrName);
    if (fqn) {
      const attrs = this._attributesFQNMap[fqn] || [];
      if (attrs.length === 0) {
        throw new Error(`attribute ${fqn} is not found.`);
      } else if (attrs.length !== 1) {
        throw new Error(`attribute ${fqn} is ambiguous. there are ${attrs.length} attributes has same fqn.`);
      }
      return attrs[0];
    } else {
      attrName = attrName as string;
      let res = this._idResolver.get(attrName);
      if (res.length === 0) {
        throw new Error(`attribute ${attrName} is not found.`);
      }
      if (res.length > 1) {
        throw new Error(`attribute ${attrName} is ambiguous. It has the following possibilities. ${res}`);
      }
      if (this._attributesFQNMap[res[0]].length !== 1) {
        throw new Error(`attribute ${attrName} is ambiguous. there are ${this._attributesFQNMap[res[0]].length} attributes has same fqn.`);
      }
      return this._attributesFQNMap[res[0]][0];
    }
  }

  public getAttribute(attrName: Name): any {
    const fqn = Ensure.tobeFQN(attrName);
    if (fqn) {
      const attrs = this._attributesFQNMap[fqn] || [];
      if (attrs.length === 0) {
        const attrBuf = this._attrBuffer.resolve(fqn, false);
        if (attrBuf !== void 0) {
          return attrBuf;
        }
        throw new Error(`attribute ${attrName} is not found.`);
      } else if (attrs.length !== 1) {
        throw new Error(`attribute ${attrName} is ambiguous. there are ${attrs.length} attributes has same fqn.`);
      }
      return attrs[0].Value;
    } else {
      attrName = attrName as string;
      let res = this._idResolver.get(attrName);
      if (res.length === 0) {
        const attrBuf = this._attrBuffer.resolve(attrName, false);
        if (attrBuf !== void 0) {
          return attrBuf;
        }
        throw new Error(`attribute ${attrName} is not found.`);
      }
      if (res.length > 1) {
        throw new Error(`attribute ${attrName} is ambiguous. there are ${this._attributesFQNMap[res[0]].length} attributes has same fqn.`);
      }
      return this._attributesFQNMap[res[0]][0].Value;
    }
  }
  public removeAttribute(attr: Attribute): boolean {
    if (this._attributesFQNMap[attr.name.fqn]) {
      let attributes = this._attributesFQNMap[attr.name.fqn];
      if (attributes.length === 1) {
        this._idResolver.remove(attr.name);
      }
      Utility.remove(attributes, attr);
      delete this._attributesFQNMap[attr.name.fqn];
      return true;
    }
    return false;
  }

  public guess(name: Name): NSIdentity[] {
    if (name instanceof NSIdentity) {
      return [name];
    }
    if (Ensure.checkFQNString(name)) {
      return [NSIdentity.fromFQN(name)];
    }
    return this._idResolver.get(name).map(fqn => NSIdentity.fromFQN(fqn));
  }
}
