import GomlNode from "../Node/GomlNode";
import ComponentInterface from "./ComponentInterface";


interface INodeInterface {
  (query: string): ComponentInterface;
  // first(): GomlNode;
  // single(): GomlNode;
  // count(): number;
  // isEmpty(): boolean;
  // get(): GomlNode;
  // forEach(callback: ((node: GomlNode) => void)): void;
}


export default INodeInterface;
