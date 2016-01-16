import Vector3 = require("../../../Math/Vector3");
import IMaterialConfigureArgument = require("../../Materials/Base/IMaterialConfigureArgument");
import BasicMaterial = require("../../Materials/Base/BasicMaterial");
import PrimitiveRegistory = require("../../Geometries/Base/PrimitiveRegistory");
import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../JThreeContext");
import Scene = require("../../Scene");
import LightBase = require("./../LightBase");
import Matrix = require("../../../Math/Matrix");

/**
 * Point Light
 * Parameter order
 * 0:X:TypeID YZW:Color.RGB*Intencity
 * 1:XYZ:POSITION.XYZ W: UNUSED (0)
 * 2:X:Distance Y:Decay
 */
class PointLight extends LightBase {
  constructor(scene: Scene) {
    super(scene);
    this.Geometry = JThreeContext.getContextComponent<PrimitiveRegistory>(ContextComponents.PrimitiveRegistory).getPrimitive("sphere");
    const material = new BasicMaterial(require("../../Materials/BuiltIn/Light/Diffuse/PointLight.html"));
    material.on("apply", (matArg: IMaterialConfigureArgument) => {
      this.Transformer.Scale = new Vector3(this.distance, this.distance, this.distance);
      material.materialVariables = {
        lightColor: this.Color.toVector().multiplyWith(this.intensity),
        decay: this.decay,
        dist: this.distance,
        lightPosition: Matrix.transformPoint(matArg.renderStage.Renderer.Camera.viewMatrix, this.Position)
      };
    });
    this.addMaterial(material);
  }

  public distance: number = 0.0;

  public intensity: number = 1.0;

  public decay: number = 1;
}

export = PointLight;
