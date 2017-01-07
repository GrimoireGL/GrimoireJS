import Attribute from "../Node/Attribute";

function NumberArrayConverter(this: Attribute, val: any): any {
  if (val instanceof Array) {
    return val;
  }
  if (typeof val === "string") {
    const splitted = val.split(",");
    return splitted.map(s => Number.parseFloat(s));
  }
}

export default NumberArrayConverter;
