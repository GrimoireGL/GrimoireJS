import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import Material = require('../../../Core/Materials/Material');
import JThreeID = require("../../../Base/JThreeID");

class MaterialNodeBase extends GomlTreeNodeBase {
  public targetMaterial: Material;

  protected ConstructMaterial(): Material {
    return null;
  }

  constructor() {
    super();
    this.attributes.defineAttribute({
      'name': {
        value: undefined,
        converter: 'string',
        onchanged: this._onNameAttrChanged,
      }
    });
  }

  private _onNameAttrChanged(attr): void {
    this.name = attr.Value;
  }

  protected nodeDidMounted() {
    super.nodeDidMounted();
    this.targetMaterial = this.ConstructMaterial();
    this.nodeManager.nodeRegister.addObject("jthree.materials", this.Name, this);
  }

  private name: string;

  /**
  * GOML Attribute
  * Identical Name for camera
  */
  public get Name(): string {
    this.name = this.name || JThreeID.getUniqueRandom(10);
    return this.name;
  }

}

export = MaterialNodeBase;
