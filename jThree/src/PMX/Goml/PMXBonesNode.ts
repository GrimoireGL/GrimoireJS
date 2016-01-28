import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import PMXNode from "./PMXNode";
class PMXBonesNode extends GomlTreeNodeBase {
  constructor(elem: HTMLElement, parent: GomlTreeNodeBase) {
    super();
    this.targetPMXNode = <PMXNode>parent;
  }


  private targetPMXNode: PMXNode;

  public get TargetPMXNode() {
    return this.targetPMXNode;
  }
}

export default PMXBonesNode;
