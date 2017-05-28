import {Nullable, Undef} from "../Base/Types";

/**
 * converter for number value.
 * number,string,null will be converted.
 * Array<number> also convertable only if length equivalent to 1.
 * @param  {any}    val [description]
 * @return {number}     [description]
 */
export default function NumberConverter(val: Nullable<number> | string | Array<number>): Undef<number> {
  if (typeof val === "number") {
    return val;
  } else if (typeof val === "string") {
    return Number.parseFloat(val);
  } else if (val === null) {
    return null;
  } else if (Array.isArray(val) && val.length === 1) {
    return val[0];
  }
  return undefined;
}
