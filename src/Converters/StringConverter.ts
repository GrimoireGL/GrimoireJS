export default function StringConverter(val: any): any {
  if (typeof val === "string") {
    return val;
  } else if (!val) {
    return val;
  } else if (typeof val.toString === "function") {
    return val.toString();
  }
}
