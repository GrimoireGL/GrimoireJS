import NSDictionary from "./NSDictionary";
import Ensure from "./Ensure";
import NSIdentity from "./NSIdentity";
import Attribute from "../Node/Attribute";

export default class AttributeManager {

  private _attrBuffer: { [fqn: string]: any } = {};
  private _watchBuffer: { [fqn: string]: (newValue: any, oldValue: any, attr: Attribute) => void } = {};

  public constructor(public tag: string, public attributes: NSDictionary<Attribute>) { }

  public addAttribute(attr: Attribute): Attribute {
    if (this.attributes.get(attr.name)) {
      console.warn(`attribute ${attr.name} is already exist in ${this.tag}`);
    }
    this.attributes.set(attr.name, attr);

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

  public watch(attrName: string | NSIdentity, watcher: ((newValue: any, oldValue: any, attr: Attribute) => void), immediate: boolean = false) {
    attrName = Ensure.ensureTobeNSIdentity(attrName);
    const attr = this.attributes.get(attrName);
    if (!attr) {
      this._watchBuffer[attrName.fqn] = watcher;
    } else {
      attr.watch(watcher, immediate);
    }
  }

  public setAttribute(attrName: string | NSIdentity, value: any): void {
    attrName = Ensure.ensureTobeNSIdentity(attrName);
    const attr = this.attributes.get(attrName);
    if (!attr) {
      this._attrBuffer[attrName.fqn] = value;
    } else {
      attr.Value = value;
    }
  }
  public getAttribute(attrName: string | NSIdentity): any {
    attrName = Ensure.ensureTobeNSIdentity(attrName);
    const attr = this.attributes.get(attrName);
    if (!attr) {
      const attrBuf = this._attrBuffer[attrName.fqn];
      if (attrBuf !== void 0) {
        return attrBuf;
      }
      console.warn(`attribute "${attrName.name}" is not found.`);
      return;
    } else {
      return attr.Value;
    }
  }
  public removeAttribute(attr: Attribute): boolean {
    return this.attributes.delete(attr.name);
  }
}
