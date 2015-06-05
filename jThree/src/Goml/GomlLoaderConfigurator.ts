import TagFactory = require("./Factories/TagFactory");
import GomlNodeListElement = require("./GomlNodeListElement");
import JThreeObject = require("../Base/JThreeObject");
import EasingFunction = require('./Easing/EasingFunctionBase');
import AssociativeArray = require('../Base/Collections/AssociativeArray');
import AttributeConvrterBase = require('./Converter/AttributeConverterBase');
declare function require(string): any;

class GomlLoaderConigurator extends JThreeObject
{
  private rootNodes:string[]=[];
  private easingFunctions:AssociativeArray<EasingFunction>=new AssociativeArray<EasingFunction>();
  private converters:AssociativeArray<AttributeConvrterBase>=new AssociativeArray<AttributeConvrterBase>();
  private gomlTagFactories: AssociativeArray<TagFactory> = new AssociativeArray<TagFactory>();

  public getConverter(name:string):AttributeConvrterBase
  {
    return this.converters.get(name);
  }

  public getEasingFunction(name:string):EasingFunction
  {
    return this.easingFunctions.get(name);
  }

  public getGomlTagFactory(tagName:string):TagFactory
  {
    return this.gomlTagFactories.get(tagName);
  }

  public get GomlRootNodes():string[]
  {
    return this.rootNodes;
  }

  constructor()
  {
    super();
    this.initializeRootObjectNames();
    this.initializeEasingFunctions();
    this.initializeConverters();
    this.initializeGomlTags();
  }

  /**
  * Initialize the array of names for root object in goml.
  */
  private initializeRootObjectNames()
  {
    this.rootNodes=require('./TopNodeList');
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

  private initializeGomlTags()
  {
    var newList: GomlNodeListElement[] = require('./GomlNodeList');
    newList.forEach((v) => {
      for (var key in v.NodeTypes) {
        var keyInString: string = key;
        keyInString = keyInString.toUpperCase();//transform into upper case
        var nodeType = v.NodeTypes[keyInString];
        var tag=new v.Factory(keyInString, nodeType);
        this.gomlTagFactories.set(tag.TagName,tag);
      }
    });
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
