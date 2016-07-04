import IApplyMaterialArgument from "../../../Materials/IApplyMaterialArgument";
import BasicMaterial from "../../../Materials/BasicMaterial";
import PrimitiveRegistory from "../../../Geometries/Base/PrimitiveRegistory";
import Context from "../../../../Context";
import ContextComponents from "../../../../ContextComponents";
import LightBase from "./../LightBase";

/**
 * Provides area light feature.
 * Parameters:
 * X:TYPE ID ,XYZ:COLOR
 */
class SceneLight extends LightBase {

    public intensity: number = 1.0;

    constructor() {
        super();
        this.Geometry = Context.getContextComponent<PrimitiveRegistory>(ContextComponents.PrimitiveRegistory).getPrimitive("quad");
        const material = new BasicMaterial(require("../../../Materials/BuiltIn/Light/Diffuse/SceneLight.xmml"), "builtin.light.scene");
        material.on("apply", (matArg: IApplyMaterialArgument) => {
            material.shaderVariables = {
                lightColor: this.Color.toVector().multiplyWith(this.intensity)
            };
        });
        this.addMaterial(material);
    }

}

export default SceneLight;
