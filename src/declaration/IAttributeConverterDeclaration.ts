import Attribute from "../Node/Attribute";
import NSIdentity from "../Base/NSIdentity";

interface IAttributeConverterDeclaration {
  name: string | NSIdentity;
  parameter: any;
  verify(attr: Attribute): boolean;
  convert(val: any, attr: Attribute): any;
}
export default IAttributeConverterDeclaration;
