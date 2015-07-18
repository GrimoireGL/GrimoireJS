import GomlTreeNodeBase = require("../../Goml/GomlTreeNodeBase");
import GomlLoader = require("../../Goml/GomlLoader");
import PMXNode = require("./PMXNode");
class PMXBonesNode extends GomlTreeNodeBase {
  constructor(elem: HTMLElement, loader: GomlLoader, parent: GomlTreeNodeBase) {
    super(elem, loader, parent);
    this.targetPMXNode = <PMXNode>parent;
  }


  private targetPMXNode: PMXNode;

  public get TargetPMXNode() {
    return this.targetPMXNode;
  }
}

export =PMXBonesNode;
