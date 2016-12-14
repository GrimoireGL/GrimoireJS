import NodeInterface from "./NodeInterface";

interface IGomlInterface {
  (query: string): NodeInterface;
}

export default IGomlInterface;
