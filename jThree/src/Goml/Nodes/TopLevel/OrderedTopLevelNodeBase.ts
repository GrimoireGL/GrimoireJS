import GomlTreeNodeBase = require("../../GomlTreeNodeBase");

class OrderedTopLevelNodeBase extends GomlTreeNodeBase {
  constructor() {
    super();
  }

  public get loadPriorty(): number {
    return void 0;
  }
}

export = OrderedTopLevelNodeBase;
