import Attribute from "../Node/Attribute";

function StringArrayConverter(this: Attribute, val: any): any {
  if (Array.isArray(val) || !val) {
    return val;
  }
  if (typeof val === "string") {
    return val.split(" ");
  }
}

export default StringArrayConverter;
