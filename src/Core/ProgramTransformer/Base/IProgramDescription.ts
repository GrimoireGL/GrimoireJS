import NamedValue from "../../../Base/NamedValue";
import IVariableDescription from "./IVariableDescription";
import IFunctionDescription from "./IFunctionDescription";
interface IProgramDescription {
  fragment: string;
  vertex: string;
  uniforms: NamedValue<IVariableDescription>;
  attributes: NamedValue<IVariableDescription>;
  fragmentPrecisions: NamedValue<string>;
  vertexPrecisions: NamedValue<string>;
  functions: NamedValue<IFunctionDescription>;
}
export default IProgramDescription;
