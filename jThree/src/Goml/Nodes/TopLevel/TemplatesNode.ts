import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import OrderedTopLevelNodeBase = require("./OrderedTopLevelNodeBase");
class TemplatesNode extends OrderedTopLevelNodeBase {
  constructor(parent: GomlTreeNodeBase) {
    super(parent);
  }

  public get loadPriorty():number
  {
    return 4000;
  }

}

export = TemplatesNode;
