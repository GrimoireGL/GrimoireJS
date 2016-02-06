import MaterialNodeBase from "./MaterialNodeBase";
import Material from "../../../Core/Materials/Material";
import GomlAttribute from "../../GomlAttribute";
import GomlTreeNodeBase from "../../GomlTreeNodeBase";

class MaterialNode extends MaterialNodeBase<Material> {
  constructor() {
    super();
    this.attributes.defineAttribute({
      "type": {
        value: "jthree.basic.phong",
        converter: "string",
        onchanged: this._onTypeAttrChanged,
      }
    });
  }

  protected onMount(): void {
    super.onMount();
  }

  private _onTypeAttrChanged(attr: GomlAttribute): void {
    let material = this.__getMaterialFromMatName(attr.Value);
    if (material) {
      console.log("exist material");
      this.Material = material;
    } else {
      this.nodeImport("jthree.import", `material-${attr.Value}`, (node: GomlTreeNodeBase) => {
        if (node) {
          console.log("imported material");
          material = this.__getMaterialFromMatName(attr.Value);
          console.log(material);
          this.Material = material;
        }
      });
    }
  }
}

export default MaterialNode;
