/**
 * 数値のためのコンバータ
 * @param  {any}    val [description]
 * @return {number}     [description]
 */
export default function NumberConverter(val: any): number {
  if (typeof val === "number") {
    return val;
  } else if (typeof val === "string") {
    return Number.parseFloat(val);
  } else if (val === null) {
    return null;
  } else if (Array.isArray(val) && val.length === 1) {
    return val[0];
  }
}
