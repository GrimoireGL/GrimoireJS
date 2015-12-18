import IVariableInfo = require("./IVariableInfo");
interface IParsedProgramResult
{
  fragment:string;
  vertex:string;
  uniforms:{[name:string]:IVariableInfo};
  attributes:{[name:string]:IVariableInfo};
}
export = IParsedProgramResult;
