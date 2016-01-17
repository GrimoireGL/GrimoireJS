import IVariableInfo = require("./IVariableInfo");
interface IParsedProgramResult {
  fragment: string;
  vertex: string;
  uniforms: { [name: string]: IVariableInfo };
  attributes: { [name: string]: IVariableInfo };
  fragmentPrecisions: { [type: string]: string };
  vertexPrecisions: { [type: string]: string };
}
export = IParsedProgramResult;
