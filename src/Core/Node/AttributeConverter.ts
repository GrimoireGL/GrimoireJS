import NamespacedIdentity from "../Base/NamespacedIdentity";

interface AttributeConverter {
  name: NamespacedIdentity;
  convert(value: any): any;
}

export default AttributeConverter;
