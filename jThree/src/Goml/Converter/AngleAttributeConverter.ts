import {InvalidArgumentException} from "../../Exceptions";
import AttributeParser from "../AttributeParser";
import AttributeConverterBase from "./AttributeConverterBase";

class AngleAttributeConverter extends AttributeConverterBase {
  public toStringAttr(val: number): string {
    return val.toString();
  }

  public toObjectAttr(attr: string): number {
    return AttributeParser.ParseAngle(attr);
  }

  public FromInterface(val: any): any {
    if (typeof val === "string") {
      return this.toObjectAttr(val);
    } else if (typeof val === "number") {
      return val;
    }
    // we should implememnt something here?
    throw new InvalidArgumentException("val can't parse");
  }
}

export default AngleAttributeConverter;
