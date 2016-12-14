import Constants from "../Base/Constants";
import GrimoireInterface from "../GrimoireInterface";
import NodeInterface from "./NodeInterface";
import GomlNode from "../Node/GomlNode";
/**
 * Provides interfaces to treat whole goml tree for each.
 */
class GomlInterface {
  constructor(public rootNodes: GomlNode[]) {

  }

  public getNodeById(id: string): GomlNode[] {
    return (new Array(this.rootNodes.length)).map((v, i) => GomlNode.fromElement(this.rootNodes[i].element.ownerDocument.getElementById(id)));
  }

  public queryFunc(query: string): NodeInterface {
    return new NodeInterface(this.queryNodes(query));
  }

  public queryNodes(query: string): GomlNode[][] {
    return this.rootNodes.map((root) => {
      const nodelist = root.element.ownerDocument.querySelectorAll(query);
      const nodes: GomlNode[] = [];
      for (let i = 0; i < nodelist.length; i++) {
        const node = GrimoireInterface.nodeDictionary[nodelist.item(i).getAttribute(Constants.x_gr_id)];
        if (node) {
          nodes.push(node);
        }
      }
      return nodes;
    });
  }
}

export default GomlInterface;
