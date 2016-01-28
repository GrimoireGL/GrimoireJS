import ProgramWrapper = require("../../../Resources/Program/ProgramWrapper");
import IVariableDescription = require("../IVariableDescription");
import IApplyMaterialArgument = require("../IApplyMaterialArgument");
const RenderStageDescriptionRegisterer = (gl: WebGLRenderingContext, pWrapper: ProgramWrapper, matArg: IApplyMaterialArgument, uniforms: { [key: string]: IVariableDescription }) => {
  if (uniforms["_techniqueIndex"]) {
    pWrapper.uniformInt("_techniqueIndex", matArg.techniqueIndex);
  }
  if (uniforms["_passIndex"]) {
    pWrapper.uniformInt("_passIndex", matArg.passIndex);
  }
  if (uniforms["_techniqueCount"]) {
    pWrapper.uniformInt("_techniqueCount", matArg.techniqueCount);
  }
  if (uniforms["_passCount"]) {
    pWrapper.uniformInt("_passCount", matArg.passCount);
  }
};

export = RenderStageDescriptionRegisterer;
