import Attribute from "../Node/Attribute";
import Component from "../Node/Component";

interface IComponentInterface {
  get<T>(): T;
  get<T>(componentIndex: number): T;
  get<T>(nodeIndex: number, componentIndex: number): T;
  get<T>(treeIndex: number, nodeIndex: number, componentIndex: number): T;
  forEach(f: (v: Component, compIndex: number, nodeIndex: number, treeIndex: number) => void): void;
  attr(attrName: string): Attribute;
  attr(attrName: string, value: any): void;
  attr(attrName: string, value?: any): Attribute | void;
  getAttribute(attrName: string): any;
  setAttribute(attrName: string, value: any): void;
}

export default IComponentInterface;
