import GomlTreeNodeBase from "../../GomlTreeNodeBase";
import TreeNodeBase from "../../TreeNodeBase";
import OrderedTopLevelNodeBase from "./OrderedTopLevelNodeBase";

class GomlNode extends GomlTreeNodeBase {
  constructor() {
    super();
  }

  /**
   * Add child to this node
   */
  public addChild(child: TreeNodeBase): void {
    super.addChild(child);
    this.__children.sort((n1, n2) => (<OrderedTopLevelNodeBase>n1).loadPriorty - (<OrderedTopLevelNodeBase>n2).loadPriorty);
  }
}

export default GomlNode;
