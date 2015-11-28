import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import OrderedTopLevelNodeBase = require("./OrderedTopLevelNodeBase");
class TemplatesNode extends OrderedTopLevelNodeBase {
  constructor(elem: HTMLElement, parent: GomlTreeNodeBase) {
    super(elem, parent);
  }

  public get loadPriorty():number
  {
    return 4000;
  }

}

export = TemplatesNode;
