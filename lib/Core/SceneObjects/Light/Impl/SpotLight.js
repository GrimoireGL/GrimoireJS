import BasicMaterial from "../../../Materials/Base/BasicMaterial";
import ContextComponents from "../../../../ContextComponents";
import JThreeContext from "../../../../JThreeContext";
import LightBase from "./../LightBase";
import Matrix from "../../../../Math/Matrix";
import Vector3 from "../../../../Math/Vector3";
/**
 * Point Light
 */
class SpotLight extends LightBase {
    constructor() {
        super();
        this.intensity = 1;
        this.innerAngle = 0.2;
        this.outerAngle = 0.5;
        this.innerDistance = 4;
        this.outerDistance = 15;
        this.angleDecay = 1.0;
        this.distanceDecay = 1.0;
        this.Geometry = JThreeContext.getContextComponent(ContextComponents.PrimitiveRegistory).getPrimitive("cone");
        const diffuseMaterial = new BasicMaterial(require("../../../Materials/BuiltIn/Light/Diffuse/SpotLight.html"));
        diffuseMaterial.on("apply", (matArg) => {
            const tan = Math.tan(this.outerAngle);
            this.Transformer.Scale = new Vector3(tan * this.outerDistance, this.outerDistance / 2, tan * this.outerDistance);
            diffuseMaterial.materialVariables = {
                lightColor: this.Color.toVector().multiplyWith(this.intensity),
                innerAngle: this.innerAngle,
                outerAngle: this.outerAngle,
                innerDistance: this.innerDistance,
                outerDistance: this.outerDistance,
                angleDecay: this.angleDecay,
                distanceDecay: this.distanceDecay,
                lightPosition: Matrix.transformPoint(matArg.camera.viewMatrix, this.Position),
                lightDirection: Matrix.transformNormal(Matrix.multiply(matArg.camera.viewMatrix, this.Transformer.LocalToGlobal), new Vector3(0, -1, 0)).normalizeThis()
            };
        });
        const specularMaterial = new BasicMaterial(require("../../../Materials/BuiltIn/Light/Specular/SpotLight.html"));
        specularMaterial.on("apply", (matArg) => {
            const tan = Math.tan(this.outerAngle);
            this.Transformer.Scale = new Vector3(tan * this.outerDistance, this.outerDistance / 2, tan * this.outerDistance);
            specularMaterial.materialVariables = {
                lightColor: this.Color.toVector().multiplyWith(this.intensity),
                angle: this.outerAngle,
                dist: this.outerDistance,
                decay: this.distanceDecay,
                lightDirection: Matrix.transformNormal(Matrix.multiply(matArg.camera.viewMatrix, this.Transformer.LocalToGlobal), new Vector3(0, -1, 0)).normalizeThis(),
                lightPosition: Matrix.transformPoint(matArg.camera.viewMatrix, this.Position)
            };
        });
        this.addMaterial(diffuseMaterial);
        this.addMaterial(specularMaterial);
    }
}
export default SpotLight;
