import NamespacedIdentity from "../Base/NamespacedIdentity";

interface AttributeConverter {
    name: NamespacedIdentity;
    convert(any): any;
}

export default AttributeConverter;
