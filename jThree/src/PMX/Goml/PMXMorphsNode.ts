import GomlTreeNodeBase = require("../../Goml/GomlTreeNodeBase");
import PMXNode = require("./PMXNode");
class PMXMorphsNode extends GomlTreeNodeBase {
  constructor(elem: HTMLElement, parent: GomlTreeNodeBase) {
    super(elem, parent);
    this.targetPMXNode = <PMXNode>parent;
  }


  private targetPMXNode: PMXNode;

  public get TargetPMXNode() {
    return this.targetPMXNode;
  }
}

export =PMXMorphsNode;
