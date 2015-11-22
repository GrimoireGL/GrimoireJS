import GomlTreeNodeBase = require("../../GomlTreeNodeBase");

class GomlNode extends GomlTreeNodeBase {
  constructor(elem: HTMLElement, parent: GomlTreeNodeBase) {
    super(elem, parent);
  }

  public get loadPriorty():number
  {
    return undefined;
  }
}

export = GomlNode;
