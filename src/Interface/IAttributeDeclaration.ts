import {Name} from "../Tools/Types";

export default interface IAttributeDeclaration {
  converter: Name;
  default: any;
  [parameters: string]: any;
}

