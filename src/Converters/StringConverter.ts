import Attribute from "../Node/Attribute";

function StringConverter(this: Attribute, val: any): any {
  if (typeof val === "string") {
    return val;
  } else if (!val) {
    return val;
  } else if (typeof val.toString === "function") {
    return val.toString();
  }
}

export default StringConverter;
