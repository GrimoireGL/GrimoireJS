import Attribute from "../Node/Attribute";

function EnumConverter(val: any, attr: Attribute): any {
  if (!attr.declaration["table"]) {
    throw new Error("Enum converter needs to be specified table in attribute dictionary");
  }
  if (typeof val === "number") {
    return val;
  }
  if (typeof val === "string") {
    const result = attr.declaration["table"][val];
    if (!result) {
      throw new Error("Specified value is not exisiting in the relation table");
    } else {
      return result;
    }
  }
  return null;
}

export default EnumConverter;
