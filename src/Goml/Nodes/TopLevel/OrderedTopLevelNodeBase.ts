import GomlTreeNodeBase from "../../GomlTreeNodeBase";

class OrderedTopLevelNodeBase extends GomlTreeNodeBase {
  constructor() {
    super();
  }

  public get loadPriorty(): number {
    return 0;
  }
}

export default OrderedTopLevelNodeBase;
