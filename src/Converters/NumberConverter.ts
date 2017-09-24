import { Nullable, Undef } from "../Tools/Types";

/**
 * converter for number value.
 * number,string,null will be converted.
 * Array<number> also convertable only if length equivalent to 1.
 * @param  {any}    val [description]
 * @return {number}     [description]
 */
export default function NumberConverter(val: any): number {
  if (typeof val === "number") {
    return val;
  }
  if (typeof val === "string") {
    let parsed = Number.parseFloat(val);
    return Number.isNaN(parsed) ? void 0 : parsed;
  }
  if (val === null) {
    return null;
  }
  if (Array.isArray(val) && val.length === 1) {
    return val[0];
  }
}
