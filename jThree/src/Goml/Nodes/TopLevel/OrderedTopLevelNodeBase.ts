import GomlTreeNodeBase = require("../../GomlTreeNodeBase");

class OrderedTopLevelNodeBase extends GomlTreeNodeBase {
  constructor() {
    super();
  }

  public get loadPriorty(): number {
    return undefined;
  }
}

export = OrderedTopLevelNodeBase;
