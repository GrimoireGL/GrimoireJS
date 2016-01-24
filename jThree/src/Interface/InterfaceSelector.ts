import GomlTreeNodeBase = require("../Goml/GomlTreeNodeBase");
import JThreeContext = require("../JThreeContext");
import ContextComponents = require("../ContextComponents");
import NodeManager = require("../Goml/NodeManager");

class InterfaceSelector {
  /**
   * Search Node from selector query.
   * @param  {string}             selector selector query string.
   * @param  {GomlTreeNodeBase}   context  target for searching.
   * @return {GomlTreeNodeBase[]}          found Nodes.
   */
  public static find(selector: string, context?: GomlTreeNodeBase): GomlTreeNodeBase[] {
    return JThreeContext.getContextComponent<NodeManager>(ContextComponents.NodeManager).getNodeByQuery(selector, context);
  }
}

export = InterfaceSelector;
