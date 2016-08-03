import INodeInterface from "./INodeInterface";
import GomlNode from "../Node/GomlNode";



class NodeInterface implements INodeInterface {
  constructor(public nodes: GomlNode[][]) {

  }
}


export default NodeInterface;
