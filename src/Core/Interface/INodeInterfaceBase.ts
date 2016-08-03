import GomlNode from "../Node/GomlNode";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import Attribute from "../Node/Attribute";


interface INodeInterfaceBase {
  attr(attrName: string|NamespacedIdentity): Attribute;
  attr(attrName: string|NamespacedIdentity, setValue: any): void;
  on(eventName: string, listener: Function): void;
  off(eventName: string, listener: Function): void;
  append(tag: string): void;
  remove(child: GomlNode): void;
  forEach(callback: ((GomlNode) => void)): void;
  setEnable(enable: boolean): void;
}

export default INodeInterfaceBase;
