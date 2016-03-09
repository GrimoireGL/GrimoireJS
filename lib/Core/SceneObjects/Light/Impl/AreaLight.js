import BasicMaterial from "../../../Materials/Base/BasicMaterial";
import ContextComponents from "../../../../ContextComponents";
import JThreeContext from "../../../../JThreeContext";
import LightBase from "./../LightBase";
import Matrix from "../../../../Math/Matrix";
/**
 * Provides area light feature.
 */
class AreaLight extends LightBase {
    constructor() {
        super();
        this.intensity = 1.0;
        this.Geometry = JThreeContext.getContextComponent(ContextComponents.PrimitiveRegistory).getPrimitive("cube");
        const material = new BasicMaterial(require("../../../Materials/BuiltIn/Light/Diffuse/AreaLight.html"));
        material.on("apply", (matArg) => {
            material.materialVariables = {
                lightColor: this.Color.toVector().multiplyWith(this.intensity),
                areaMatrix: Matrix.inverse(Matrix.multiply(matArg.camera.viewMatrix, matArg.object.Transformer.LocalToGlobal))
            };
        });
        this.addMaterial(material);
    }
}
export default AreaLight;
