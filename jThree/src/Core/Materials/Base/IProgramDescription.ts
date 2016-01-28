import IVariableDescription = require("./IVariableDescription");
interface IProgramDescription {
  fragment: string;
  vertex: string;
  uniforms: { [name: string]: IVariableDescription };
  attributes: { [name: string]: IVariableDescription };
  fragmentPrecisions: { [type: string]: string };
  vertexPrecisions: { [type: string]: string };
}
export = IProgramDescription;
