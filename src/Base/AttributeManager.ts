import Utility from "./Utility";
import Ensure from "./Ensure";
import NSIdentity from "./NSIdentity";
import Attribute from "../Node/Attribute";
import {Name} from "../Base/Types";

export default class AttributeManager {
  private _attributesMap: { [name: string]: Attribute[] } = {};
  private _attributesFQNMap: { [fqn: string]: Attribute[] } = {};

  private _attrBuffer: { [fqn: string]: any } = {};
  private _watchBuffer: { [fqn: string]: (newValue: any, oldValue: any, attr: Attribute) => void } = {};

  public constructor(public tag: string) { }

  public addAttribute(attr: Attribute): Attribute {
    const fqn = attr.name.fqn;
    const name = attr.name.name;
    if (this._attributesMap[name] !== void 0) {
      Utility.w(`attribute ${attr.name} is already exist in ${this.tag}`);
    } else {
      this._attributesMap[name] = [];
    }
    if (this._attributesFQNMap[fqn] === void 0) {
      this._attributesFQNMap[fqn] = [];
    }
    this._attributesMap[name].push(attr);
    this._attributesFQNMap[fqn].push(attr);

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
      const attrs = this._attributesMap[attrName];
      if (attrs === void 0 || attrs.length === 0) {
        this._watchBuffer[Ensure.tobeNSIdentity(attrName).fqn] = watcher;
        return;
      }
      const attrFQN = attrs[0].name.fqn;
      for (let i = 1; i < attrs.length; i++) {
        if (attrFQN !== attrs[i].name.fqn) {
          throw new Error(`attribute ${attrName} is ambigious`);
        }
      }
      for (let i = 0; i < attrs.length; i++) {
        attrs[i].watch(watcher, immediate);
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
      const attrs = this._attributesMap[attrName];
      if (attrs === void 0 || attrs.length === 0) {
        this._attrBuffer[Ensure.tobeNSIdentity(attrName).fqn] = value;
        return;
      }
      const attrFQN = attrs[0].name.fqn;
      for (let i = 1; i < attrs.length; i++) {
        if (attrFQN !== attrs[i].name.fqn) {
          throw new Error(`attribute ${attrName} is ambigious`);
        }
      }
      for (let i = 0; i < attrs.length; i++) {
        attrs[i].Value = value;
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
      const attrs = this._attributesMap[attrName];
      if (attrs === void 0 || attrs.length === 0) {
        const attrBuf = this._attrBuffer[Ensure.tobeNSIdentity(attrName).fqn];
        if (attrBuf !== void 0) {
          return attrBuf;
        }
        throw new Error(`attribute ${attrName} is not found.`);
      }
      if (attrs.length !== 1) {
        throw new Error(`attribute ${attrName} is ambigious`);
      }
      return attrs[0];
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
      Utility.remove(this._attributesFQNMap[attr.name.fqn], attr);
      Utility.remove(this._attributesMap[attr.name.name], attr);
      delete this._attributesFQNMap[attr.name.fqn];
      if (this._attributesMap[attr.name.name].length === 0) {
        delete this._attributesMap[attr.name.name];
      }
      return true;
    }
    return false;
  }
}
