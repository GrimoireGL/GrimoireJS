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
      this.setMaterial(material, () => {
        attr.done();
      });
    } else {
      this.nodeImport("jthree.import", `material-${attr.Value}`, (node: GomlTreeNodeBase) => {
        if (node) {
          material = this.__getMaterialFromMatName(attr.Value);
          this.setMaterial(material, () => {
            attr.done();
          });
        }
        attr.done();
      });
    }
  }
}

export default MaterialNode;
