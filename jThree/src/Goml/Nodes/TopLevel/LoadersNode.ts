import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import OrderedTopLevelNodeBase = require("./OrderedTopLevelNodeBase");
class LoadersNode extends OrderedTopLevelNodeBase {
  constructor() {
    super();
  }

  public get loadPriorty(): number {
    return 1000;
  }

}

export = LoadersNode;
