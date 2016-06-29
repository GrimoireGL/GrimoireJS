import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import Context from "../../Context";
import ContextComponents from "../../ContextComponents";
import NodeManager from "../../Goml/NodeManager";

class Find {
  /**
   * Search Node from selector query.
   * @param  {string}             selector selector query string.
   * @param  {GomlTreeNodeBase}   context  target for searching.
   * @return {GomlTreeNodeBase[]}          found Nodes.
   */
  public static find(selector: string, context?: GomlTreeNodeBase): GomlTreeNodeBase[] {
    return Context.getContextComponent<NodeManager>(ContextComponents.NodeManager).getNodeByQuery(selector, context);
  }
}

export default Find;
