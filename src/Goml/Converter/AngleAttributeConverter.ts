import AttributeParser from "../AttributeParser";
import AttributeConverterBase from "./AttributeConverterBase";
import isNumber from "lodash.isnumber";

class AngleAttributeConverter extends AttributeConverterBase {
  public name: string = "angle";

  public toStringAttr(val: any): string {
    return val.toString();
  }

  public toObjectAttr(attr: any): number {
    return isNumber(attr) ? attr : AttributeParser.parseAngle(attr);
  }
}

export default AngleAttributeConverter;
