import TextureBase from "../../../Resources/Texture/TextureBase";
import RBO from "../../../Resources/RBO/RBO";
import RegistererBase from "./RegistererBase";
import ProgramWrapper from "../../../Resources/Program/ProgramWrapper";
import IVariableDescription from "../../../ProgramTransformer/Base/IVariableDescription";
import IApplyMaterialArgument from "../IApplyMaterialArgument";

class BufferRegitserer extends RegistererBase {
  public getName(): string {
    return "builtin.buffer";
  }

  public register(gl: WebGLRenderingContext, pWrapper: ProgramWrapper, matArg: IApplyMaterialArgument, uniforms: { [key: string]: IVariableDescription }): void {
    for (let variableName in uniforms) {
      const uniform = uniforms[variableName];
      if (variableName[0] !== "_" || uniform.variableType !== "sampler2D") { continue; }
      if (uniform.variableAnnotation["type"] === "buffer") {
        const bufferName = uniform.variableAnnotation["name"];
        if (!bufferName || !matArg.textureResource[bufferName]) {
          continue;
        }
        let register: number = uniform.variableAnnotation["register"];
        if (!register) { register = 0; }
        if (matArg.textureResource[bufferName] instanceof RBO) {
          throw new Error("RBO can not be acceptable for shader argument");
        }
        pWrapper.uniformSampler(variableName, matArg.textureResource[bufferName] as TextureBase, register);
      }
    }
  }
}

export default BufferRegitserer;
