import Vector3 from "../../../../Math/Vector3";
import BasicMaterial from "../../../Materials/Base/BasicMaterial";
import ContextComponents from "../../../../ContextComponents";
import JThreeContext from "../../../../JThreeContext";
import LightBase from "./../LightBase";
import Matrix from "../../../../Math/Matrix";
/**
 * Point Light
 */
class PointLight extends LightBase {
    constructor() {
        super();
        this.distance = 0.0;
        this.intensity = 1.0;
        this.decay = 1;
        this.Geometry = JThreeContext.getContextComponent(ContextComponents.PrimitiveRegistory).getPrimitive("sphere");
        const diffuseMaterial = new BasicMaterial(require("../../../Materials/BuiltIn/Light/Diffuse/PointLight.html"));
        diffuseMaterial.on("apply", (matArg) => {
            this.Transformer.Scale = new Vector3(this.distance, this.distance, this.distance);
            diffuseMaterial.materialVariables = {
                lightColor: this.Color.toVector().multiplyWith(this.intensity),
                decay: this.decay,
                dist: this.distance,
                lightPosition: Matrix.transformPoint(matArg.camera.viewMatrix, this.Position)
            };
        });
        const specularMaterial = new BasicMaterial(require("../../../Materials/BuiltIn/Light/Specular/PointLight.html"));
        specularMaterial.on("apply", (matArg) => {
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
}
export default PointLight;
