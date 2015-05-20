import JThreeObject = require("../Base/JThreeObject");
import JThreeCollection = require("../Base/JThreeCollection");
import GomlAttribute = require("./GomlAttribute");
import Delegates = require("../Delegates");
import GomlLoader = require("./GomlLoader");


class AttributeDictionary extends JThreeObject
{
  constructor(loader:GomlLoader,element:HTMLElement)
  {
    super();
    this.loader=loader;
    this.element=element;
  }

  private loader:GomlLoader;

  private element:HTMLElement;

  private attributes:JThreeCollection<GomlAttribute>=new JThreeCollection<GomlAttribute>();

  public getValue(attrName:string):any
  {
    var attr=this.attributes.getById(attrName);
    if(attr==null)console.warn("attribute \"{0}\" is not found.".format(attrName));
    else
      return attr.Value;
  }

  public setValue(attrName:string,value:any):void
  {
    var attr=this.attributes.getById(attrName);
    if(attr==null)console.warn("attribute \"{0}\" is not found.".format(attrName));
    else
      attr.Value=value;;
  }

  public isDefined(attrName:string):boolean
  {
    return this.attributes.getById(attrName)!=null;
  }

  public defineAttribute(attributes:{[key:string]:{value?:any;converter:string;handler?:Delegates.Action1<GomlAttribute>}})
  {
    for(var key in attributes)
    {
      var attribute=attributes[key];
      this.attributes.insert(new GomlAttribute(this.element,key,attribute.value,this.loader.converters.get(attribute.converter),attribute.handler));
    }
  }
}

export=AttributeDictionary;
