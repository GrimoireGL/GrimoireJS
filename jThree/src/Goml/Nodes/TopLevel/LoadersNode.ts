import OrderedTopLevelNodeBase from "./OrderedTopLevelNodeBase";

class LoadersNode extends OrderedTopLevelNodeBase {
  constructor() {
    super();
  }

  public get loadPriorty(): number {
    return 1000;
  }

}

export default LoadersNode;
