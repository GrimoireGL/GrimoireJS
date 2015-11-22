import GomlTreeNodeBase = require("../../GomlTreeNodeBase");

class OrderedTopLevelNodeBase extends GomlTreeNodeBase {
  constructor(elem: HTMLElement, parent: GomlTreeNodeBase) {
    super(elem, parent);
  }

  public get loadPriorty():number
  {
    return undefined;
  }
}

export = OrderedTopLevelNodeBase;
