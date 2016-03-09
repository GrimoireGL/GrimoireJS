import LightBase from "../LightBase";
import BasicMaterial from "../../../Materials/Base/BasicMaterial";
import Vector3 from "../../../../Math/Vector3";
import Matrix from "../../../../Math/Matrix";
import ContextComponents from "../../../../ContextComponents";
import JThreeContext from "../../../../JThreeContext";
/**
 * Provides directional light feature.
 */
class DirectionalLight extends LightBase {
    constructor() {
        super();
        this.bias = 0.2;
        this.Geometry = JThreeContext.getContextComponent(ContextComponents.PrimitiveRegistory).getPrimitive("quad");
        const diffuseMaterial = new BasicMaterial(require("../../../Materials/BuiltIn/Light/Diffuse/DirectionalLight.html"));
        diffuseMaterial.on("apply", (matArg) => {
            diffuseMaterial.materialVariables = {
                lightColor: this.Color.toVector().multiplyWith(this.intensity),
                lightDirection: Vector3.normalize(Matrix.transformNormal(matArg.renderStage.Renderer.Camera.viewMatrix, this.__transformer.forward))
            };
        });
        const specularMaterial = new BasicMaterial(require("../../../Materials/BuiltIn/Light/Specular/DirectionalLight.html"));
        specularMaterial.on("apply", (matArg) => {
            specularMaterial.materialVariables = {
                lightColor: this.Color.toVector().multiplyWith(this.intensity),
                lightDirection: Vector3.normalize(Matrix.transformNormal(matArg.renderStage.Renderer.Camera.viewMatrix, this.__transformer.forward))
            };
        });
        this.addMaterial(diffuseMaterial);
        this.addMaterial(specularMaterial);
    }
}
export default DirectionalLight;
