import Attribute from "../Node/Attribute";


function NumberConverter(this: Attribute, val: any): number {
  if (typeof val === "number") {
    return val;
  } else if (typeof val === "string") {
    return Number.parseFloat(val);
  } else if (val === null) {
    return null;
  }
}

export default NumberConverter;
