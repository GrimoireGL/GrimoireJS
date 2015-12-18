import IUniformVariableInfo = require("./IUniformVariableInfo");
interface IParsedProgramResult
{
  fragment:string;
  vertex:string;
  uniforms:IUniformVariableInfo[];
}
export = IParsedProgramResult;
