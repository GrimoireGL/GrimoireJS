import Exceptions = require("../../Exceptions");
import AttributeConverterBase = require("./AttributeConverterBase");
class StringAttributeConverter extends AttributeConverterBase
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
    return attr;
  }

  public FromInterface(val:any):any
  {
    if(typeof val === "string")
    {
      return this.FromAttribute(val);
    }
    //we should implememnt something here?
    throw new Exceptions.InvalidArgumentException("val can't parse");
  }
}

export=StringAttributeConverter;
