import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import OrderedTopLevelNodeBase = require("./OrderedTopLevelNodeBase");
class ScenesNode extends OrderedTopLevelNodeBase {
  constructor() {
    super();
  }

  public get loadPriorty(): number {
    return 5000;
  }

}

export = ScenesNode;
