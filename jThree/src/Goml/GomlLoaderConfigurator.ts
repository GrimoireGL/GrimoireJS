import JThreeObject = require("../Base/JThreeObject");
import EasingFunction = require('./Easing/EasingFunctionBase');
import AssociativeArray = require('../Base/Collections/AssociativeArray');
import AttributeConvrterBase = require('./Converter/AttributeConverterBase');
declare function require(string): any;

class GomlLoaderConigurator extends JThreeObject
{
  private rootObjectNames:string[]=[];
  private easingFunctions:AssociativeArray<EasingFunction>=new AssociativeArray<EasingFunction>();
  private converters:AssociativeArray<AttributeConvrterBase>=new AssociativeArray<AttributeConvrterBase>();

  public getConverter(name:string):AttributeConvrterBase
  {
    return this.converters.get(name);
  }

  public getEasingFunction(name:string):EasingFunction
  {
    return this.easingFunctions.get(name);
  }

  constructor()
  {
    super();
    this.initializeRootObjectNames();
    this.initializeEasingFunctions();
    this.initializeConverters();
  }

  /**
  * Initialize the array of names for root object in goml.
  */
  private initializeRootObjectNames()
  {
    this.rootObjectNames=require('./TopNodeList');
  }

  /**
  * Initialize associative array for easing functions that will be used for animation in goml.
  */
  private initializeEasingFunctions()
  {
    this.loadIntoAssociativeArray(this.easingFunctions,require('./EasingFunctionList'));
  }

  private initializeConverters()
  {
    this.loadIntoAssociativeArray(this.converters,require('./GomlConverterList'));
  }

  /**
  * Initialize something associative array from required hash.
  */
  private loadIntoAssociativeArray<T>(targetArray:AssociativeArray<T>,list:{ [key: string]: any })
  {
    for (var key in list)
    {
      var type = list[key];
      targetArray.set(key,new type());
    }
  }
}
export = GomlLoaderConigurator;
