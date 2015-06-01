import JThreeObject = require("../../Base/JThreeObject");
import Exceptions = require("../../Exceptions");
import AttributeParser = require("../AttributeParser");
import AttributeConverterBase = require("./AttributeConverterBase");
class BooleanAttributeConverter extends AttributeConverterBase
{
  constructor()
  {
    super();
  }

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
    return this.FromAttribute(val);
  }
}

export=BooleanAttributeConverter;
