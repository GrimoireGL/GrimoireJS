import IApplyMaterialArgument from "../Base/IApplyMaterialArgument";
import BasicMaterial from "../Base/BasicMaterial";
class PrimaryBufferMaterial extends BasicMaterial {
  constructor() {
    super(require("../BuiltIn/GBuffer/PrimaryBuffer.html"));
  }

  public apply(matArg: IApplyMaterialArgument): void {
    const fm = matArg.object.getMaterial("builtin.forward"); // brightness
    let brightness = 0;
    const fmArgs = fm.materialVariables;
    if (fmArgs["brightness"]) {
      brightness = fmArgs["brightness"];
    }
    this.materialVariables["brightness"] = brightness;
    super.apply(matArg);
  }
}

export default PrimaryBufferMaterial;
