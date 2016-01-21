import OrderedTopLevelNodeBase = require("./OrderedTopLevelNodeBase");

class CanvasesNode extends OrderedTopLevelNodeBase {
  constructor() {
    super();
  }

  public get loadPriorty(): number {
    return 2000;
  }

}

export = CanvasesNode;
