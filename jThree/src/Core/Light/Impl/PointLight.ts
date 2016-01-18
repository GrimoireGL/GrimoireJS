import Vector3 = require("../../../Math/Vector3");
import IMaterialConfigureArgument = require("../../Materials/Base/IMaterialConfigureArgument");
import BasicMaterial = require("../../Materials/Base/BasicMaterial");
import PrimitiveRegistory = require("../../Geometries/Base/PrimitiveRegistory");
import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../JThreeContext");
import LightBase = require("./../LightBase");
import Matrix = require("../../../Math/Matrix");

/**
 * Point Light
 */
class PointLight extends LightBase {
  constructor() {
    super();
    this.Geometry = JThreeContext.getContextComponent<PrimitiveRegistory>(ContextComponents.PrimitiveRegistory).getPrimitive("sphere");
    const diffuseMaterial = new BasicMaterial(require("../../Materials/BuiltIn/Light/Diffuse/PointLight.html"));
    diffuseMaterial.on("apply", (matArg: IMaterialConfigureArgument) => {
      this.Transformer.Scale = new Vector3(this.distance, this.distance, this.distance);
      diffuseMaterial.materialVariables = {
        lightColor: this.Color.toVector().multiplyWith(this.intensity),
        decay: this.decay,
        dist: this.distance,
        lightPosition: Matrix.transformPoint(matArg.camera.viewMatrix, this.Position)
       };
    });
    const specularMaterial = new BasicMaterial(require("../../Materials/BuiltIn/Light/Specular/PointLight.html"));
    specularMaterial.on("apply", (matArg: IMaterialConfigureArgument) => {
      this.Transformer.Scale = new Vector3(this.distance, this.distance, this.distance);
      specularMaterial.materialVariables = {
        lightColor: this.Color.toVector().multiplyWith(this.intensity),
        decay: this.decay,
        dist: this.distance,
        lightPosition: Matrix.transformPoint(matArg.camera.viewMatrix, this.Position)
      };
    });
    this.addMaterial(diffuseMaterial);
    this.addMaterial(specularMaterial);
  }

  public distance: number = 0.0;

  public intensity: number = 1.0;

  public decay: number = 1;
}

export = PointLight;
