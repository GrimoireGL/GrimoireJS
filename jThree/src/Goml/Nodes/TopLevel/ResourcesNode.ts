import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import OrderedTopLevelNodeBase = require("./OrderedTopLevelNodeBase");
class ResourcesNode extends OrderedTopLevelNodeBase {
  constructor(elem: HTMLElement, parent: GomlTreeNodeBase) {
    super(elem, parent);
  }

  public get loadPriorty():number
  {
    return 3000;
  }

}

export = ResourcesNode;
