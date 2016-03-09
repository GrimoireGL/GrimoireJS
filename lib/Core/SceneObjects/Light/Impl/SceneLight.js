import BasicMaterial from "../../../Materials/Base/BasicMaterial";
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
        this.intensity = 1.0;
        this.Geometry = JThreeContext.getContextComponent(ContextComponents.PrimitiveRegistory).getPrimitive("quad");
        const material = new BasicMaterial(require("../../../Materials/BuiltIn/Light/Diffuse/SceneLight.html"));
        material.on("apply", (matArg) => {
            material.materialVariables = {
                lightColor: this.Color.toVector().multiplyWith(this.intensity)
            };
        });
        this.addMaterial(material);
    }
}
export default SceneLight;
