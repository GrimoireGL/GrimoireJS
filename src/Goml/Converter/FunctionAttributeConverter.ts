import AttributeConverterBase from "./AttributeConverterBase";
import isFunction from "lodash.isfunction";

class FunctionAttributeConverter extends AttributeConverterBase {
  public name: string = "function";

  public toStringAttr(val: any): string {
    return val.toString().match(/function\sanonymous\(\)\s\{\n([\s\S]+)\n\}/m)[1];
  }

  public toObjectAttr(attr: any): () => any {
    return isFunction(attr) ? attr : new Function(attr);
  }
}

export default FunctionAttributeConverter;
