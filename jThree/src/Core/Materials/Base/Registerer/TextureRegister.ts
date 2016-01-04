import ProgramWrapper = require("../../../Resources/Program/ProgramWrapper");
import IVariableInfo = require("../IVariableInfo");
import IMaterialConfigureArgument = require("../IMaterialConfigureArgument");
const TextureRegister = (gl: WebGLRenderingContext, pWrapper: ProgramWrapper, matArg: IMaterialConfigureArgument, uniforms: { [key: string]: IVariableInfo }) => {
  for(let key in uniforms)
  {
    const uniform = uniforms[key];
    if(uniform.variableType != "sampler2D")continue;
    const sourceType = uniform.variableAnnotation["type"];
    switch(sourceType)
    {
      default:
        console.warn(`Unknown texture source type:${sourceType}. src will be interpreted as url`);
      case "url":

    }
  }
}

export = TextureRegister;
