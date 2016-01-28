import BasicMaterial from "../Base/BasicMaterial";
import IApplyMaterialArgument from "../Base/IApplyMaterialArgument";
import Vector4 from "../../../Math/Vector4";

class HitAreaMaterial extends BasicMaterial {
  constructor() {
    super(require("../BuiltIn/HitAreaTest.html"));
  }

  public apply(matArg: IApplyMaterialArgument): void {
    const r = 0xFF00 & (matArg.renderStage as any).___objectIndex;
    const g = 0x00FF & (matArg.renderStage as any).___objectIndex;
    this.materialVariables["indexColor"] = new Vector4(r / 0xFF, g / 0xFF, 0, 1);
    super.apply(matArg);
  }
}

export default HitAreaMaterial;
