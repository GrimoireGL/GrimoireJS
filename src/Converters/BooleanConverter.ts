import { Undef } from "../Tools/Types";

/**
 * converter for booleam value.
 * Pass through boolean value as it is.
 * Pass through string value only 'true' or 'false'.
 * @param  {any}       val  [description]
 * @param  {Attribute} attr [description]
 * @return {any}            [description]
 */
export default function BooleanConverter(val: any): Undef<boolean> {
  if (typeof val === "boolean") {
    return val;
  } else if (typeof val === "string") {
    switch (val) {
      case "true":
        return true;
      case "false":
        return false;
    }
  }
  return void 0;
}
