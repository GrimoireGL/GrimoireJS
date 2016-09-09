import NSIdentity from "../Base/NSIdentity";

interface AttributeConverter {
  name: NSIdentity;
  convert(value: any): any;
}

export default AttributeConverter;
