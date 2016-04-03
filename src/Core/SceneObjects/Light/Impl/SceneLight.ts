import IApplyMaterialArgument from "../../../Materials/IApplyMaterialArgument";
import BasicMaterial from "../../../Materials/BasicMaterial";
import PrimitiveRegistory from "../../../Geometries/Base/PrimitiveRegistory";
import JThreeContext from "../../../../JThreeContext";
import ContextComponents from "../../../../ContextComponents";
import LightBase from "./../LightBase";

/**
 * Provides area light feature.
 * Parameters:
 * X:TYPE ID ,XYZ:COLOR
 */
class SceneLight extends LightBase {
  constructor() {
    super();
    this.Geometry = JThreeContext.getContextComponent<PrimitiveRegistory>(ContextComponents.PrimitiveRegistory).getPrimitive("quad");
    const material = new BasicMaterial(require("../../../Materials/BuiltIn/Light/Diffuse/SceneLight.xmml"), "builtin.light.scene");
    material.on("apply", (matArg: IApplyMaterialArgument) => {
      material.shaderVariables = {
        lightColor: this.Color.toVector().multiplyWith(this.intensity)
      };
    });
    this.addMaterial(material);
  }

  public intensity: number = 1.0;

}

export default SceneLight;
