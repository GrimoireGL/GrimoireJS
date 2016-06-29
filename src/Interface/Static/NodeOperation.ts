import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import NodeManager from "../../Goml/NodeManager";

class NodeOperation {
  public static insert(targets: GomlTreeNodeBase[], contents: GomlTreeNodeBase[], indexFunc?: (target: GomlTreeNodeBase, index: number) => number): void {
    targets.forEach((target, i) => {
      let nodeOpMethod = NodeManager.insertNode;
      if (i === targets.length) {
        nodeOpMethod = NodeManager.moveNode;
      }
      const index = indexFunc && indexFunc(target, i);
      contents.forEach((content, j) => {
        nodeOpMethod.call(NodeManager, content, target, typeof index === "undefined" ? void 0 : index + j);
      });
    });
  }

  public static remove(targets: GomlTreeNodeBase[]): void {
    targets.forEach((target, i) => {
      NodeManager.removeNode(target);
    });
  }

  public static clone(targets: GomlTreeNodeBase[], withEvents: boolean, deepWithEvents: boolean): GomlTreeNodeBase[] {
    if (deepWithEvents) {
      withEvents = true;
    }
    return targets.map((target) => {
      return NodeManager.cloneNode(target, withEvents, deepWithEvents);
    });
  }
}

export default NodeOperation;
