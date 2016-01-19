import IApplyMaterialArgument = require("../Base/IApplyMaterialArgument");
import BasicMaterial = require("../Base/BasicMaterial");
class PrimaryBufferMaterial extends BasicMaterial {
  constructor() {
    super(require("../BuiltIn/GBuffer/PrimaryBuffer.html"));
  }

  public apply(matArg: IApplyMaterialArgument): void {
    var fm = matArg.object.getMaterial("jthree.materials.forematerial");//brightness
    var brightness = 0;
    const fmArgs = fm.materialVariables;
    if (fmArgs["brightness"]) brightness = fmArgs["brightness"];
    this.materialVariables["brightness"] = brightness;
    super.apply(matArg);
  }
}

export = PrimaryBufferMaterial;
