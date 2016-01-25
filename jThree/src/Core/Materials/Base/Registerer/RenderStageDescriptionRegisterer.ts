import ProgramWrapper = require("../../../Resources/Program/ProgramWrapper");
import IVariableInfo = require("../IVariableInfo");
import IApplyMaterialArgument = require("../IApplyMaterialArgument");
const RenderStageDescriptionRegisterer = (gl: WebGLRenderingContext, pWrapper: ProgramWrapper, matArg: IApplyMaterialArgument, uniforms: { [key: string]: IVariableInfo }) => {
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
