import GomlNode from "../Node/GomlNode";
import IComponentInterface from "./IComponentInterface";
import INodeInterfaceBase from "./INodeInterfaceBase";


interface INodeInterface extends INodeInterfaceBase {
  (query: string): IComponentInterface;
  first(): GomlNode;
  single(): GomlNode;
  count(): number;
  isEmpty(): boolean;
  get(): GomlNode;
  forEach(callback: ((node: GomlNode) => void)): void;
}


export default INodeInterface;
