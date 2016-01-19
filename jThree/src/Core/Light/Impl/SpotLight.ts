import IMaterialConfigureArgument = require("../../Materials/Base/IMaterialConfigureArgument");
import BasicMaterial = require("../../Materials/Base/BasicMaterial");
import PrimitiveRegistory = require("../../Geometries/Base/PrimitiveRegistory");
import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../JThreeContext");
import Scene = require('../../Scene');
import LightBase = require('./../LightBase');
import BasicRenderer = require("../../Renderers/BasicRenderer");
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
    diffuseMaterial.on("apply", (matArg: IMaterialConfigureArgument) => {
      //this.Transformer.Scale = new Vector3(1, 10, 1);

      diffuseMaterial.materialVariables =
      {
        lightColor: this.Color.toVector().multiplyWith(this.intensity),
        innerAngle: this.innerAngle
      };
    });
    this.addMaterial(diffuseMaterial);
  }

  public intensity: number = 1;
  public innerAngle: number = 1.744;
  public outerAngle: number = 2.5;
  public innerDistance: number = 3;
  public outerDistance: number = 5;
}

export = SpotLight;
