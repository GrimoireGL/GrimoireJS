import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import OrderedTopLevelNodeBase = require("./OrderedTopLevelNodeBase");
class CanvasesNode extends OrderedTopLevelNodeBase {
  constructor(parent: GomlTreeNodeBase) {
    super(parent);
  }

  public get loadPriorty():number
  {
    return 2000;
  }

}

export = CanvasesNode;
