import IArgumentDescription from "./IArgumentDescription";
interface IFunctionDescription {
  functionName: string;
  functionType: string;
  functionPrecision: string;
  functionArgments: IArgumentDescription[];
}
export default IFunctionDescription;
