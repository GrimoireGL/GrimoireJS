import NodeInterface from "./NodeInterface";
import Component from "../Node/Component";
import GomlNode from "../Node/GomlNode";
import NSIdentity from "../Base/NSIdentity";
import Attribute from "../Node/Attribute";


interface INodeInterfaceBase {
  getAttribute(attrName: string | NSIdentity): any;
  setAttribute(attrName: string | NSIdentity, value: any): void;
  on(eventName: string, listener: Function): void;
  off(eventName: string, listener: Function): void;
  append(tag: string): void;
  remove(child: GomlNode): void;
  setEnable(enable: boolean): void;
  find(query: string): Component[];
  children(): NodeInterface;
  addComponent(componentId: NSIdentity): NodeInterface;

}

export default INodeInterfaceBase;
