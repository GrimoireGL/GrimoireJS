import Component from "../Node/Component";
import INodeInterfaceBase from "./INodeInterfaceBase";
import ComponentInterface from "./ComponentInterface";
import IComponentInterface from "./IComponentInterface";
import GomlNode from "../Node/GomlNode";



class NodeInterface implements INodeInterfaceBase {
  constructor(public nodes: GomlNode[][]) {

  }
  public queryFunc(query: string): IComponentInterface {
    return  new ComponentInterface(this.queryComponents(query));
  }

  public queryComponents(query: string): Component[][][]{
    return null; // TODO: implement!
  }
}


export default NodeInterface;
