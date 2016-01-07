import Exceptions = require("../../Exceptions");
import AttributeParser = require("../AttributeParser");
import AttributeConverterBase = require("./AttributeConverterBase");
class AngleAttributeConverter extends AttributeConverterBase
{
  public ToAttribute(val:any):string
  {
    return val;
  }

  public FromAttribute(attr:string):any
  {
    return AttributeParser.ParseAngle(attr);
  }

  public FromInterface(val:any):any
  {
    if(typeof val === 'string')
    {
      return this.FromAttribute(val);
    }else if(typeof val === 'number')
    {
      return val;
    }
    //we should implememnt something here?
    throw new Exceptions.InvalidArgumentException("val can't parse");
  }
}

export=AngleAttributeConverter;
