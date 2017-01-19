export default function NumberArrayConverter(val: any): any {
  if (val instanceof Array) {
    return val;
  }
  if (typeof val === "string") {
    const splitted = val.split(",");
    return splitted.map(s => Number.parseFloat(s));
  }
}
