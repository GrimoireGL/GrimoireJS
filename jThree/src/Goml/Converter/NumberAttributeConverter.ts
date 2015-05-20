import JThreeObject = require("../../Base/JThreeObject");
import AttributeConverterBase = require("./AttributeConverterBase");
import AttributeParser = require("../AttributeParser");
import Exceptions = require("../../Exceptions");
class NumberAttributeConverter extends AttributeConverterBase
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
    return Number(attr);
  }

  public FromInterface(val:any):any
  {
    if(typeof val === 'string')
    {
      return Number(val);
    }else if(typeof val === 'number')
    {
      return val;
    }
    //we should implememnt something here?
    throw new Exceptions.InvalidArgumentException("val can't parse");
  }
}

export=NumberAttributeConverter;
