import Exceptions = require("../../Exceptions");
import AttributeConverterBase = require("./AttributeConverterBase");
class StringAttributeConverter extends AttributeConverterBase {
  public ToAttribute(val: string): string {
    return val == null ? '' : val; // double equal char comparision to null is ok
  }

  public FromAttribute(attr: string): string {
    return attr;
  }

  public FromInterface(val: string): string {
    if (typeof val === 'string') {
      return this.FromAttribute(val);
    } else if (typeof val === "undefined") {
      return "";
    } else if (val === null) {
      return null;
    }
    //we should implememnt something here?
    throw new Exceptions.InvalidArgumentException("val can't parse");
  }
}

export = StringAttributeConverter;
