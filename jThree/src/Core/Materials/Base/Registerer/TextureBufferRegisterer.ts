import ProgramWrapper from "../../../Resources/Program/ProgramWrapper";
import IVariableDescription from "../IVariableDescription";
import IApplyMaterialArgument from "../IApplyMaterialArgument";
const TextureBufferRegisterer = (gl: WebGLRenderingContext, pWrapper: ProgramWrapper, matArg: IApplyMaterialArgument, uniforms: { [key: string]: IVariableDescription }) => {
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
      pWrapper.uniformSampler(variableName, matArg.textureResource[bufferName], register);
    }
  }
};

export default TextureBufferRegisterer;
