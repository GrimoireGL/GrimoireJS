import IApplyMaterialArgument from "../../../Materials/IApplyMaterialArgument";
import BasicMaterial from "../../../Materials/BasicMaterial";
import ContextComponents from "../../../../ContextComponents";
import PrimitiveRegistory from "../../../Geometries/Base/PrimitiveRegistory";
import JThreeContext from "../../../../JThreeContext";
import LightBase from "./../LightBase";
import Matrix from "../../../../Math/Matrix";

/**
 * Provides area light feature.
 */
class AreaLight extends LightBase {
  constructor() {
    super();
    this.Geometry = JThreeContext.getContextComponent<PrimitiveRegistory>(ContextComponents.PrimitiveRegistory).getPrimitive("cube");
    const material = new BasicMaterial(require("../../../Materials/BuiltIn/Light/Diffuse/AreaLight.xmml"));
    material.on("apply", (matArg: IApplyMaterialArgument) => {
      material.shaderVariables = {
        lightColor: this.Color.toVector().multiplyWith(this.intensity),
        areaMatrix: Matrix.inverse(Matrix.multiply(matArg.camera.viewMatrix, matArg.object.Transformer.LocalToGlobal))
      };
    });
    this.addMaterial(material);
  }

  public intensity: number = 1.0;
}

export default AreaLight;
