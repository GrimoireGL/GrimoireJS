import Utility from "./Utility";
import Ensure from "./Ensure";
import Attribute from "../Node/Attribute";
import IdResolver from "../Base/IdResolver";
import Namespace from "../Base/Namespace";
import NSIdentity from "../Base/NSIdentity";
import {Name} from "../Base/Types";

export default class AttributeManager {
  private _attributesFQNMap: { [fqn: string]: Attribute[] } = {};

  private _idResolver: IdResolver = new IdResolver();

  private _attrBuffer: { [fqn: string]: any } = {};
  private _watchBuffer: { [fqn: string]: (newValue: any, oldValue: any, attr: Attribute) => void } = {};

  public constructor(public tag: string) { }

  public addAttribute(attr: Attribute): Attribute {
    const fqn = attr.name.fqn;
    if (this._idResolver.has(fqn)) {
      Utility.w(`attribute ${attr.name} is already exist in ${this.tag}`);
    }
    if (this._attributesFQNMap[fqn] === void 0) {
      this._attributesFQNMap[fqn] = [];
    }
    this._attributesFQNMap[fqn].push(attr);
    this._idResolver.add(attr.name);

    // check buffer value.
    const attrBuf = this._attrBuffer[attr.name.fqn];
    if (attrBuf !== void 0) {
      attr.Value = attrBuf;
      delete this._attrBuffer[attr.name.fqn];
    }

    const watchBuf = this._watchBuffer[attr.name.fqn];
    if (watchBuf) {
      attr.watch(watchBuf, true);
    }
    return attr;
  }

  public watch(attrName: Name, watcher: ((newValue: any, oldValue: any, attr: Attribute) => void), immediate = false) {
    if (typeof attrName === "string") {
      let res = this._idResolver.get(Namespace.defineByArray(attrName.split(".")));
      if (res.length === 0) {
        this._watchBuffer[Ensure.tobeNSIdentity(attrName).fqn] = watcher;
        return;
      }
      if (res.length > 1) {
        throw new Error(`attribute ${attrName} is ambigious`);
      }
      for (let i = 0; i < this._attributesFQNMap[res[0]].length; i++) {
        this._attributesFQNMap[res[0]][i].watch(watcher, immediate);
      }
    } else {
      const attrs = this._attributesFQNMap[attrName.fqn];
      if (attrs === void 0 || attrs.length === 0) {
        this._watchBuffer[attrName.fqn] = watcher;
        return;
      }
      for (let i = 0; i < attrs.length; i++) {
        attrs[i].watch(watcher, immediate);
      }
    }
  }

  public setAttribute(attrName: Name, value: any): void {
    if (typeof attrName === "string") {
      let res = this._idResolver.get(Namespace.defineByArray(attrName.split(".")));
      if (res.length === 0) {
        this._attrBuffer[Ensure.tobeNSIdentity(attrName).fqn] = value;
        return;
      }
      if (res.length > 1) {
        throw new Error(`attribute ${attrName} is ambigious`);
      }
      for (let i = 0; i < this._attributesFQNMap[res[0]].length; i++) {
        this._attributesFQNMap[res[0]][i].Value = value;
      }
    } else {
      const attrs = this._attributesFQNMap[attrName.fqn];
      if (attrs === void 0 || attrs.length === 0) {
        this._attrBuffer[attrName.fqn] = value;
        return;
      }
      for (let i = 0; i < attrs.length; i++) {
        attrs[i].Value = value;
      }
    }
  }
  public getAttribute(attrName: Name): Attribute {
    if (typeof attrName === "string") {
      let res = this._idResolver.get(Namespace.defineByArray(attrName.split(".")));
      if (res.length === 0) {
        const attrBuf = this._attrBuffer[Ensure.tobeNSIdentity(attrName).fqn];
        if (attrBuf !== void 0) {
          return attrBuf;
        }
        throw new Error(`attribute ${attrName} is not found.`);
      }
      if (res.length > 1) {
        throw new Error(`attribute ${attrName} is ambigious`);
      }
      return this._attributesFQNMap[res[0]][0];
    } else {
      const attrs = this._attributesFQNMap[attrName.fqn];
      if (attrs === void 0 || attrs.length === 0) {
        const attrBuf = this._attrBuffer[attrName.fqn];
        if (attrBuf !== void 0) {
          return attrBuf;
        }
        throw new Error(`attribute ${attrName} is not found.`);
      } else if (attrs.length !== 1) {
        throw new Error(`attribute ${attrName} is ambigious`);
      }
      return attrs[0];
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
    return this._idResolver.get(Namespace.defineByArray(name.split("."))).map(fqn => NSIdentity.fromFQN(fqn));
  }
}
