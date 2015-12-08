import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import OrderedTopLevelNodeBase = require("./OrderedTopLevelNodeBase");
class ResourcesNode extends OrderedTopLevelNodeBase {
  constructor() {
    super();
  }

  public get loadPriorty(): number {
    return 3000;
  }

}

export = ResourcesNode;
