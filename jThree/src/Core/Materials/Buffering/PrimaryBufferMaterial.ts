import IApplyMaterialArgument = require("../Base/IApplyMaterialArgument");
import BasicMaterial = require("../Base/BasicMaterial");
class PrimaryBufferMaterial extends BasicMaterial {
  constructor() {
    super(require("../BuiltIn/GBuffer/PrimaryBuffer.html"));
  }

  public apply(matArg: IApplyMaterialArgument): void {
    const fm = matArg.object.getMaterial("jthree.materials.forematerial"); // brightness
    let brightness = 0;
    const fmArgs = fm.materialVariables;
    if (fmArgs["brightness"]) {
      brightness = fmArgs["brightness"];
    }
    this.materialVariables["brightness"] = brightness;
    super.apply(matArg);
  }
}

export = PrimaryBufferMaterial;
