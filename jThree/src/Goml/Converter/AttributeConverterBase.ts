import JThreeObject = require("../../Base/JThreeObject");
import Exceptions = require("../../Exceptions");
class AttributeConverterBase extends JThreeObject
{
  constructor()
  {
    super();
  }

  public ToAttribute(val:any):string
  {
    throw new Exceptions.AbstractClassMethodCalledException();
  }

  public FromAttribute(attr:string):any
  {
    throw new Exceptions.AbstractClassMethodCalledException();
  }

  public FromInterface(val:any):any
  {
    throw new Exceptions.AbstractClassMethodCalledException();
  }
}

export=AttributeConverterBase;
