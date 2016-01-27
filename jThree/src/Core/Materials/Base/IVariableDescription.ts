interface IVariableDescription {
  variableName: string;
  variableType: string;
  variablePrecision: string;
  variableAnnotation: { [key: string]: any; };
  isArray: boolean;
  arrayLength: number;
}
export = IVariableDescription;
