import Constants from "./Constants";
import GomlNode from "../Core/GomlNode";
import GrimoireInterface from "../Core/GrimoireInterface";
import NodeInterface from "./NodeInterface";

/**
 * Provides interfaces to treat whole goml tree for each.
 */
export default class GomlInterface {
  constructor(public rootNodes: GomlNode[]) {

  }

  /**
   * This function is executed when GOMLInterface is called as a function.
   * Return all nodes matching the query as NodeInterface from rootNodes.
   * @param query query string
   */
  public queryFunc(query: string): NodeInterface {
    return new NodeInterface(this._queryNodes(query));
  }

  private _queryNodes(query: string): GomlNode[][] {
    return this.rootNodes.map(root => {
      const nodelist = root.element.ownerDocument.querySelectorAll(query);
      const nodes: GomlNode[] = [];
      for (let i = 0; i < nodelist.length; i++) {
        const id = nodelist.item(i).getAttribute(Constants.x_gr_id);
        if (id) {
          const node = GrimoireInterface.nodeDictionary[id];
          if (node) {
            nodes.push(node);
          }
        }
      }
      return nodes;
    });
  }
}
