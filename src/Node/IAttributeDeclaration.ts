import NSIdentity from "../Base/NSIdentity";
interface IAttributeDeclaration {
  converter: string | NSIdentity;
  default: any;
  readonly?: boolean;
  [parameters: string]: any;
}

export default IAttributeDeclaration;
