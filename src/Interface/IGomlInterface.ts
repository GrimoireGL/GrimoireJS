import NodeInterface from "./NodeInterface";
import INodeInterface from "./INodeInterface";

interface IGomlInterface {
  (query: string): (INodeInterface & NodeInterface);
}

export default IGomlInterface;
