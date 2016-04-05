import IApplyMaterialArgument from "../../../Materials/IApplyMaterialArgument";
import BasicMaterial from "../../../Materials/BasicMaterial";
import PrimitiveRegistory from "../../../Geometries/Base/PrimitiveRegistory";
import ContextComponents from "../../../../ContextComponents";
import JThreeContext from "../../../../JThreeContext";
import LightBase from "./../LightBase";
import Matrix from "../../../../Math/Matrix";
import Vector3 from "../../../../Math/Vector3";
/**
 * Point Light
 */
class SpotLight extends LightBase {
  constructor() {
    super();
    this.Geometry = JThreeContext.getContextComponent<PrimitiveRegistory>(ContextComponents.PrimitiveRegistory).getPrimitive("cone");
    const diffuseMaterial = new BasicMaterial(require("../../../Materials/BuiltIn/Light/Diffuse/SpotLight.xmml"), "builtin.light.spot.diffuse");
    diffuseMaterial.on("apply", (matArg: IApplyMaterialArgument) => {
      const tan = Math.tan(this.outerAngle);
      this.Transformer.Scale = new Vector3(tan * this.outerDistance, this.outerDistance / 2, tan * this.outerDistance);

      diffuseMaterial.shaderVariables = {
        lightColor: this.Color.toVector().multiplyWith(this.intensity),
        innerAngle: this.innerAngle,
        outerAngle: this.outerAngle,
        innerDistance: this.innerDistance,
        outerDistance: this.outerDistance,
        angleDecay: this.angleDecay,
        distanceDecay: this.distanceDecay,
        lightPosition: Matrix.transformPoint(matArg.renderStage.renderer.camera.viewMatrix, this.Position),
        lightDirection: Matrix.transformNormal(Matrix.multiply(matArg.renderStage.renderer.camera.viewMatrix, this.Transformer.localToGlobal), new Vector3(0, -1, 0)).normalizeThis()
      };
    });
    const specularMaterial = new BasicMaterial(require("../../../Materials/BuiltIn/Light/Specular/SpotLight.xmml"), "builtin.light.spot.specular");
    specularMaterial.on("apply", (matArg: IApplyMaterialArgument) => {
      const tan = Math.tan(this.outerAngle);
      this.Transformer.Scale = new Vector3(tan * this.outerDistance, this.outerDistance / 2, tan * this.outerDistance);

      specularMaterial.shaderVariables = {
        lightColor: this.Color.toVector().multiplyWith(this.intensity),
        angle: this.outerAngle,
        dist: this.outerDistance,
        decay: this.distanceDecay,
        lightDirection: Matrix.transformNormal(Matrix.multiply(matArg.renderStage.renderer.camera.viewMatrix, this.Transformer.localToGlobal), new Vector3(0, -1, 0)).normalizeThis(),
        lightPosition: Matrix.transformPoint(matArg.renderStage.renderer.camera.viewMatrix, this.Position)
      };
    });
    this.addMaterial(diffuseMaterial);
    this.addMaterial(specularMaterial);
  }

  public intensity: number = 1;
  public innerAngle: number = 0.2;
  public outerAngle: number = 0.5;
  public innerDistance: number = 4;
  public outerDistance: number = 15;
  public angleDecay: number = 1.0;
  public distanceDecay: number = 1.0;
}

export default SpotLight;
