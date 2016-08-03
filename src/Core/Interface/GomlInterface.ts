import INodeInterface from "./INodeInterface";
import NodeInterface from "./NodeInterface";
import GomlNode from "../Node/GomlNode";
import IGomlInterfaceBase from "./IGomlInterfaceBase";
/**
 * Provides interfaces to treat whole goml tree for each.
 */
class GomlInterface implements IGomlInterfaceBase {
  constructor(public rootNodes: GomlNode[]) {

  }

  public queryFunc(query: string): INodeInterface {
    const context = new NodeInterface(this.queryNodes(query));
    const queryFunc = context.queryFunc;
    Object.setPrototypeOf(queryFunc, context);
    return (queryFunc.bind(context)) as INodeInterface;
  }

  public queryNodes(query: string): GomlNode[][] {
    return null; // TODO: implement!
  }
}

export default GomlInterface;
