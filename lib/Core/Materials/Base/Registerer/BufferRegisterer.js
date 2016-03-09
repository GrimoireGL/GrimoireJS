import RBO from "../../../Resources/RBO/RBO";
import RegistererBase from "./RegistererBase";
class BufferRegitserer extends RegistererBase {
    getName() {
        return "builtin.buffer";
    }
    register(gl, pWrapper, matArg, uniforms) {
        for (let variableName in uniforms) {
            const uniform = uniforms[variableName];
            if (variableName[0] !== "_" || uniform.variableType !== "sampler2D") {
                continue;
            }
            if (uniform.variableAnnotation["type"] === "buffer") {
                const bufferName = uniform.variableAnnotation["name"];
                if (!bufferName || !matArg.textureResource[bufferName]) {
                    continue;
                }
                let register = uniform.variableAnnotation["register"];
                if (!register) {
                    register = 0;
                }
                if (matArg.textureResource[bufferName] instanceof RBO) {
                    throw new Error("RBO can not be acceptable for shader argument");
                }
                pWrapper.uniformSampler(variableName, matArg.textureResource[bufferName], register);
            }
        }
    }
}
export default BufferRegitserer;
