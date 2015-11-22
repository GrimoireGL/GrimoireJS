import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import Delegates = require("../../../Base/Delegates");
import TreeNodeBase = require("../../TreeNodeBase");
import OrderedTopLevelNodeBase = require("./OrderedTopLevelNodeBase");
class GomlNode extends GomlTreeNodeBase {
  constructor(elem: HTMLElement, parent: GomlTreeNodeBase) {
    super(elem, parent);
  }

  /**
   * Add child to this node
   */
  public addChild(child:TreeNodeBase):void
  {
      super.addChild(child);
      this.children.sort((n1,n2)=>(<OrderedTopLevelNodeBase>n1).loadPriorty-(<OrderedTopLevelNodeBase>n2).loadPriorty);
  }
}

export = GomlNode;
