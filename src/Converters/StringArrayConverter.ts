export default function StringArrayConverter(val: any): any {
  if (Array.isArray(val) || !val) {
    return val;
  }
  if (typeof val === "string") {
    return val.split(" ");
  }
}
