import JThreeObject = require("../../Base/JThreeObject");
import Exceptions = require("../../Exceptions");
import AttributeParser = require("../AttributeParser");

class AngleAttributeConverter extends JThreeObject
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
    return AttributeParser.ParseAngle(attr);
  }

  public FromInterface(val:any):any
  {
    if(typeof val === 'string')
    {
      return this.FromAttribute(val);
    }else if(typeof val === 'object')
    {
      return val;
    }
    //we should implememnt something here?
    throw new Exceptions.InvalidArgumentException("val can't parse");
  }
}

export=AngleAttributeConverter;
