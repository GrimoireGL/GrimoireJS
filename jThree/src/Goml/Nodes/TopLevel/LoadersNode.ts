import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import OrderedTopLevelNodeBase = require("./OrderedTopLevelNodeBase");
class LoadersNode extends OrderedTopLevelNodeBase {
  constructor(parent: GomlTreeNodeBase) {
    super(parent);
  }

  public get loadPriorty():number
  {
    return 1000;
  }

}

export = LoadersNode;
