import OrderedTopLevelNodeBase from "./OrderedTopLevelNodeBase";
class ResourcesNode extends OrderedTopLevelNodeBase {
  protected groupPrefix: string = "resource";

  constructor() {
    super();
  }

  public get loadPriorty(): number {
    return 3000;
  }
}

export default ResourcesNode;
