import Attribute from "../Node/Attribute";
import NSIdentity from "../Base/NSIdentity";
import {Name} from "../Base/Types";

interface IAttributeConverterDeclaration {
  name: Name;
  [params: string]: any;
  verify(attr: Attribute): void; // throw error if attribute is not satisfy condition converter needed.
  convert(val: any, attr: Attribute): any;
}
export default IAttributeConverterDeclaration;
