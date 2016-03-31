import IApplyMaterialArgument from "../IApplyMaterialArgument";
import BasicMaterial from "../BasicMaterial";
class PrimaryBufferMaterial extends BasicMaterial {
  constructor() {
    super(require("../BuiltIn/GBuffer/PrimaryBuffer.xmml"), "builtin.gbuffer.1");
  }

  public apply(matArg: IApplyMaterialArgument): void {
    const fm = matArg.object.getMaterial("builtin.forward"); // brightness
    let brightness = 0;
    const fmArgs = fm.shaderVariables;
    if (fmArgs["brightness"]) {
      brightness = fmArgs["brightness"];
    }
    this.shaderVariables["brightness"] = brightness;
    super.apply(matArg);
  }
}

export default PrimaryBufferMaterial;
