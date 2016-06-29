import IApplyMaterialArgument from "../../../Materials/IApplyMaterialArgument";
import BasicMaterial from "../../../Materials/BasicMaterial";
import PrimitiveRegistory from "../../../Geometries/Base/PrimitiveRegistory";
import LightBase from "./../LightBase";
import Matrix from "../../../../Math/Matrix";

/**
 * Provides area light feature.
 */
class AreaLight extends LightBase {
    public intensity: number = 1.0;

    constructor() {
        super();
        this.Geometry = PrimitiveRegistory.getPrimitive("cube");
        const material = new BasicMaterial(require("../../../Materials/BuiltIn/Light/Diffuse/AreaLight.xmml"), "builtin.light.area");
        material.on("apply", (matArg: IApplyMaterialArgument) => {
            material.shaderVariables = {
                lightColor: this.Color.toVector().multiplyWith(this.intensity),
                areaMatrix: Matrix.inverse(Matrix.multiply(matArg.renderStage.renderer.camera.viewMatrix, matArg.object.Transformer.localToGlobal))
            };
        });
        this.addMaterial(material);
    }
}

export default AreaLight;
