function BooleanConverter(val: any): any {
  if (typeof val === "boolean") {
    return val;
  } else if (typeof val === "string") {
    switch (val) {
      case "true":
        return true;
      case "false":
        return false;
      default:
        throw new Error(`Invalid string ${val} for parsing as boolean`);
    }
  }
  throw new Error(`Parsing failed: ${val}`);
}

export default BooleanConverter;
