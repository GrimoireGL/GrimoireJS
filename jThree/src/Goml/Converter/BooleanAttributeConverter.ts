import AttributeConverterBase = require("./AttributeConverterBase");
class BooleanAttributeConverter extends AttributeConverterBase
{
  public ToAttribute(val:any):string
  {
    return val;
  }

  public FromAttribute(attr:string):any
  {
    return attr === 'true';
  }

  public FromInterface(val:any):any
  {
    if(typeof val === 'boolean')return val;
    return this.FromAttribute(val);
  }
}

export=BooleanAttributeConverter;
