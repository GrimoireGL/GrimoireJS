import Attribute from "../Node/Attribute";

function StringArrayConverter(this: Attribute, val: any): any {
  if (Array.isArray(val) || !val) {
    return val;
  }
  if (typeof val === "string") {
    return val.split(" ");
  }
  throw new Error("value is not supported by StringArrayConverter.:" + val);
}

export default StringArrayConverter;
