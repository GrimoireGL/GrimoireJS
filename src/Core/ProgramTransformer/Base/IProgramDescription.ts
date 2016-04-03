import IVariableDescription from "./IVariableDescription";
import IFunctionDescription from "./IFunctionDescription";
interface IProgramDescription {
  fragment: string;
  vertex: string;
  uniforms: { [name: string]: IVariableDescription };
  attributes: { [name: string]: IVariableDescription };
  fragmentPrecisions: { [type: string]: string };
  vertexPrecisions: { [type: string]: string };
  functions: { [name: string]: IFunctionDescription };
}
export default IProgramDescription;
