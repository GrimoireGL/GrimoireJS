import XMLReader from "../Base/XMLReader";
import GomlParser from "../Node/GomlParser";
import Attribute from "../Node/Attribute";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import Component from "../Node/Component";
import INodeInterfaceBase from "./INodeInterfaceBase";
import ComponentInterface from "./ComponentInterface";
import IComponentInterface from "./IComponentInterface";
import GomlNode from "../Node/GomlNode";



class NodeInterface implements INodeInterfaceBase {
  constructor(public nodes: GomlNode[][]) {

  }
  public queryFunc(query: string): IComponentInterface {
    return new ComponentInterface(this.queryComponents(query));
  }

  public queryComponents(query: string): Component[][][] {
    return null; // TODO: implement!
  }

  public attr(attrName: string|NamespacedIdentity): Attribute;
  public attr(attrName: string|NamespacedIdentity, value: any): void;
  public attr(attrName: string|NamespacedIdentity, value?: any): Attribute|void {
    if (value === void 0) {
      // return Attribute.
      this.forEach((node) => {
        const attr = node.attributes.get(attrName as string);
        if (!attr) {
          return attr;
        }
      });
    } else {
      // set value.
      this.forEach((node) => {
        const attr = node.attributes.get(attrName as string);
        if (!attr) {
          attr.Value = value;
        }
      });
    }
  }
  public on(eventName: string, listener: Function): void {
    this.forEach((node) => {
      node.on(eventName, listener);
    });
  }
  public off(eventName: string, listener: Function): void {
    this.forEach((node) => {
      node.removeListener(eventName, listener);
    })
  }
  public append(tag: string): void {
    this.forEach((node) => {
      const elems = XMLReader.parseXML(tag);
      const nodes = elems.map((elem) => GomlParser.parse(elem));
      nodes.forEach((child) => {
        node.addChild(child);
      });
    })
  }
  public remove(child: GomlNode): void {
    this.forEach((node) => {
      node.removeChild(child);
    });
  }
  public forEach(callback: ((node: GomlNode) => void)): void {
    this.nodes.forEach((array) => {
      array.forEach((node) => {
        callback(node);
      });
    });
  }
  public setEnable(enable: boolean): void {
    this.forEach((node) => {
      node.enable = !!enable;
    });
  }
}


export default NodeInterface;
