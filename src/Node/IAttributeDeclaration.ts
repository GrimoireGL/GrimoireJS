import {Name} from "../Base/Types";

interface IAttributeDeclaration {
  converter: Name;
  default: any;
  [parameters: string]: any;
}

export default IAttributeDeclaration;
