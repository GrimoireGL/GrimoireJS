import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import OrderedTopLevelNodeBase = require("./OrderedTopLevelNodeBase");
class ScenesNode extends OrderedTopLevelNodeBase {
  constructor(parent: GomlTreeNodeBase) {
    super(parent);
  }

  public get loadPriorty():number
  {
    return 5000;
  }

}

export = ScenesNode;
