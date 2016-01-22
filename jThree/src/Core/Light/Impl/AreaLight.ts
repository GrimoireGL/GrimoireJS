import IApplyMaterialArgument = require("../../Materials/Base/IApplyMaterialArgument");
import BasicMaterial = require("../../Materials/Base/BasicMaterial");
import ContextComponents = require("../../../ContextComponents");
import PrimitiveRegistory = require("../../Geometries/Base/PrimitiveRegistory");
import JThreeContext = require("../../../JThreeContext");
import LightBase = require("./../LightBase");
import Matrix = require("../../../Math/Matrix");

/**
 * Provides area light feature.
 */
class AreaLight extends LightBase {
  constructor() {
    super();
    this.Geometry = JThreeContext.getContextComponent<PrimitiveRegistory>(ContextComponents.PrimitiveRegistory).getPrimitive("cube");
    const material = new BasicMaterial(require("../../Materials/BuiltIn/Light/Diffuse/AreaLight.html"));
    material.on("apply", (matArg: IApplyMaterialArgument) => {
      material.materialVariables = {
        lightColor: this.Color.toVector().multiplyWith(this.intensity),
        areaMatrix: Matrix.inverse(Matrix.multiply(matArg.camera.viewMatrix, matArg.object.Transformer.LocalToGlobal))
      };
    });
    this.addMaterial(material);
  }

  public intensity: number = 1.0;
}

export = AreaLight;
