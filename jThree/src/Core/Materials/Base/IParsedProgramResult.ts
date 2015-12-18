import IVariableInfo = require("./IVariableInfo");
interface IParsedProgramResult
{
  fragment:string;
  vertex:string;
  uniforms:IVariableInfo[];
  attributes:IVariableInfo[];
}
export = IParsedProgramResult;
