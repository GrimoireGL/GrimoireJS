import Matrix = require("../../../../Math/Matrix");
import ProgramWrapper = require("../../../Resources/Program/ProgramWrapper");
import IVariableInfo = require("../IVariableInfo");
import IMaterialConfigureArgument = require("../IMaterialConfigureArgument");
const LightBufferRegisterer = (gl: WebGLRenderingContext, pWrapper: ProgramWrapper, matArg: IMaterialConfigureArgument, uniforms: { [key: string]: IVariableInfo }) => {
  if(uniforms["_dlBuffer"])
    pWrapper.uniformSampler("_dlBuffer",matArg.textureResource["DLIGHT"],0);
  if(uniforms["_slBuffer"])
    pWrapper.uniformSampler("_slBuffer",matArg.textureResource["SLIGHT"],1);
}

export = LightBufferRegisterer;
