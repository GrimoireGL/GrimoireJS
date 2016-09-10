import Attribute from "./Attribute";
import NSIdentity from "../Base/NSIdentity";

interface AttributeConverter {
  name: NSIdentity;
  convert(this: Attribute, value: any): any;
}

export default AttributeConverter;
