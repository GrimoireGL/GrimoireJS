import GomlNode from "../Node/GomlNode";
import IComponentInterface from "./IComponentInterface";


interface INodeInterface {
  (query: string): IComponentInterface;
  // first(): GomlNode;
  // single(): GomlNode;
  // count(): number;
  // isEmpty(): boolean;
  // get(): GomlNode;
  // forEach(callback: ((node: GomlNode) => void)): void;
}


export default INodeInterface;
