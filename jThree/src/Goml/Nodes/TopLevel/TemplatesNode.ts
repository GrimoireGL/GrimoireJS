import OrderedTopLevelNodeBase = require("./OrderedTopLevelNodeBase");

class TemplatesNode extends OrderedTopLevelNodeBase {
  constructor() {
    super();
  }

  public get loadPriorty(): number {
    return 4000;
  }

}

export = TemplatesNode;
