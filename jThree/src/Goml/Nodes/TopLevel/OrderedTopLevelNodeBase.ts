import GomlTreeNodeBase = require("../../GomlTreeNodeBase");

class OrderedTopLevelNodeBase extends GomlTreeNodeBase {
  constructor(parent: GomlTreeNodeBase) {
    super(parent);
  }

  public get loadPriorty():number
  {
    return undefined;
  }
}

export = OrderedTopLevelNodeBase;
