import IDObject from "../Base/IDObject";

class AttributeConverter extends IDObject {
  public name: string = null;

  public toStringAttr: (any) => string;
  public toObjectAttr: (any) => any;
  public validate: (any) => boolean;

  /**
   * Validate the compatibility of converter type.
   * @param  {any}     val Value for check
   * @return {boolean}     Valid or not
   */
  // public abstract validate(val: any): boolean;
}

export default AttributeConverter;
