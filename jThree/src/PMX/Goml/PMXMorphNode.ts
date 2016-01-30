import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import PMXNode from "./PMXNode";
class PMXMorphNode extends GomlTreeNodeBase {

  private targetPMX: PMXNode;

  constructor(elem: HTMLElement, parent: GomlTreeNodeBase, pmx: PMXNode) { // TODO: pnly
    super();
    this.targetPMX = pmx;
    // this.targetPMX.onPMXTargetUpdate((e, o) => { this.attributes.updateValue(); });
    this.attributes.defineAttribute({
      "name":
      {
        value: "",
        converter: "string"
      },
      "value":
      {
        value: 0,
        converter: "number",
        handler: (v) => {
          if (this.targetPMX.PMXModelReady) {
            const key = this.attributes.getValue("name");
            const target = this.targetPMX.PMXModel.MorphManager.getMorphByName(key);
            if (target != null) {
              target.Progress = v.Value;
            }
          }
        }
      }
    });
  }
}

export default PMXMorphNode;
