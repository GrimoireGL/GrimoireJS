import IDObject from "../Base/IDObject";

abstract class AttributeConverter extends IDObject {
  public name: string = null;

  /**
   * convert to string
   * @param  {any}    val Value with specified type.
   * @return {string}     Value with string.
   */
  public abstract toStringAttr(val: any): string;

  /**
   * convert to specified type
   * @param  {any} val  Type should be string but, value may have already been a target type.
   * @return {any}      Value with specified type.
   */
  public abstract toObjectAttr(val: any): any;

  /**
   * Validate the compatibility of converter type.
   * @param  {any}     val Value for check
   * @return {boolean}     Valid or not
   */
  public abstract validate(val: any): boolean;
}

export default AttributeConverter;
