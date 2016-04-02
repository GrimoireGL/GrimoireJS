import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
import NodeManager from "../../Goml/NodeManager";

class NodeOperation {
  public static insert(targets: GomlTreeNodeBase[], contents: GomlTreeNodeBase[], indexFunc?: (target: GomlTreeNodeBase, index: number) => number): void {
    const nodeManager = JThreeContext.getContextComponent<NodeManager>(ContextComponents.NodeManager);
    targets.forEach((target, i) => {
      let nodeOpMethod = nodeManager.insertNode;
      if (i === targets.length) {
        nodeOpMethod = nodeManager.moveNode;
      }
      const index = indexFunc && indexFunc(target, i);
      contents.forEach((content, j) => {
        nodeOpMethod.call(nodeManager, content, target, typeof index === "undefined" ? void 0 : index + j);
      });
    });
  }

  public static remove(targets: GomlTreeNodeBase[]): void {
    const nodeManager = JThreeContext.getContextComponent<NodeManager>(ContextComponents.NodeManager);
    targets.forEach((target, i) => {
      nodeManager.removeNode(target);
    });
  }

  public static clone(targets: GomlTreeNodeBase[], withEvents: boolean, deepWithEvents: boolean): GomlTreeNodeBase[] {
    if (deepWithEvents) {
      withEvents = true;
    }
    const nodeManager = JThreeContext.getContextComponent<NodeManager>(ContextComponents.NodeManager);
    return targets.map((target) => {
      return nodeManager.cloneNode(target, withEvents, deepWithEvents);
    });
  }
}

export default NodeOperation;
