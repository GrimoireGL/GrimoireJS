export default function NumberConverter(val: any): number {
  if (typeof val === "number") {
    return val;
  } else if (typeof val === "string") {
    return Number.parseFloat(val);
  } else if (val === null) {
    return null;
  }
}
