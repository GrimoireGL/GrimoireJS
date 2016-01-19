interface IVariableInfo {
  variableName: string;
  variableType: string;
  variablePrecision: string;
  variableAnnotation: { [key: string]: string };
  isArray: boolean;
  arrayLength: number;
}
export = IVariableInfo;
