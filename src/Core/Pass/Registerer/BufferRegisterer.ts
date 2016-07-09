import NamedValue from "../../../Base/NamedValue";
import TextureBase from "../../Resources/Texture/TextureBase";
import RBO from "../../Resources/RBO/RBO";
import RegistererBase from "./RegistererBase";
import ProgramWrapper from "../../Resources/Program/ProgramWrapper";
import IVariableDescription from "../../ProgramTransformer/Base/IVariableDescription";
import IApplyMaterialArgument from "../../Materials/IApplyMaterialArgument";

class BufferRegitserer extends RegistererBase {
  public getName(): string {
    return "builtin.buffer";
  }

  public register(gl: WebGLRenderingContext, pWrapper: ProgramWrapper, matArg: IApplyMaterialArgument, uniforms: NamedValue<IVariableDescription>): void {
    for (let variableName in uniforms) {
      const uniform = uniforms[variableName];
      if (variableName[0] !== "_" || uniform.variableType !== "sampler2D") { continue; }
      if (uniform.variableAnnotation["type"] === "buffer") {
        const bufferName = uniform.variableAnnotation["name"];
        if (!bufferName || !matArg.renderStage.bufferTextures[bufferName]) {
          continue;
        }
        let register: number = uniform.variableAnnotation["register"];
        if (!register) { register = 0; }
        if (matArg.renderStage.bufferTextures[bufferName] instanceof RBO) {
          throw new Error("RBO can not be acceptable for shader argument");
        }
        pWrapper.uniformSampler(variableName, matArg.renderStage.bufferTextures[bufferName] as TextureBase, register);
      }
    }
  }
}

export default BufferRegitserer;
