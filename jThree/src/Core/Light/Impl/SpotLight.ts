import IApplyMaterialArgument = require("../../Materials/Base/IApplyMaterialArgument");
import BasicMaterial = require("../../Materials/Base/BasicMaterial");
import PrimitiveRegistory = require("../../Geometries/Base/PrimitiveRegistory");
import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../JThreeContext");
import LightBase = require("./../LightBase");
import Matrix = require("../../../Math/Matrix");
import Vector3 = require("../../../Math/Vector3");
/**
 * Point Light
 */
class SpotLight extends LightBase {
  constructor() {
    super();
    this.Geometry = JThreeContext.getContextComponent<PrimitiveRegistory>(ContextComponents.PrimitiveRegistory).getPrimitive("cone");
    const diffuseMaterial = new BasicMaterial(require("../../Materials/BuiltIn/Light/Diffuse/SpotLight.html"));
    diffuseMaterial.on("apply", (matArg: IApplyMaterialArgument) => {
      const tan = Math.tan(this.outerAngle);
      this.Transformer.Scale = new Vector3(tan * this.outerDistance, this.outerDistance / 2, tan * this.outerDistance);

      diffuseMaterial.materialVariables = {
        lightColor: this.Color.toVector().multiplyWith(this.intensity),
        innerAngle: this.innerAngle,
        outerAngle: this.outerAngle,
        innerDistance: this.innerDistance,
        outerDistance: this.outerDistance,
        angleDecay: this.angleDecay,
        distanceDecay: this.distanceDecay,
        lightPosition: Matrix.transformPoint(matArg.camera.viewMatrix, this.Position),
        lightDirection: Matrix.transformNormal(Matrix.multiply(matArg.camera.viewMatrix, this.Transformer.LocalToGlobal), new Vector3(0, -1, 0)).normalizeThis()
      };
    });
    this.addMaterial(diffuseMaterial);
  }

  public intensity: number = 1;
  public innerAngle: number = 0.2;
  public outerAngle: number = 0.5;
  public innerDistance: number = 4;
  public outerDistance: number = 15;
  public angleDecay: number = 1.0;
  public distanceDecay: number = 1.0;
}

export = SpotLight;
