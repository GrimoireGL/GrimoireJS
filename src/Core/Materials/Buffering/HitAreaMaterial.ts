import BasicMaterial from "../BasicMaterial";
import IApplyMaterialArgument from "../IApplyMaterialArgument";
import Vector4 from "../../../Math/Vector4";

class HitAreaMaterial extends BasicMaterial {
  constructor() {
    super(require("../BuiltIn/HitAreaTest.xmml"));
  }

  public apply(matArg: IApplyMaterialArgument): void {
    const r = (0xFF00 & (matArg.renderStage as any).objectIndex) >> 16;
    const g = 0x00FF & (matArg.renderStage as any).objectIndex;
    this.shaderVariables["indexColor"] = new Vector4(r / 0xFF, g / 0xFF, 0, 1);
    super.apply(matArg);
  }
}

export default HitAreaMaterial;
