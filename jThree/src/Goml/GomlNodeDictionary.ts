import jThreeObject = require("../Base/JThreeObject");
import GomlTreeNodeBase = require("./GomlTreeNodeBase");
import AssociativeArray = require('../Base/Collections/AssociativeArray');
import JThreeEvent = require('../Base/JThreeEvent');
import Delegates = require('../Base/Delegates');
/**
 * Dictionary class to cache GOML node objects.
 */
class GomlNodeDictionary extends jThreeObject
{
  /**
   * actual dictionary
   */
  private dictionary:AssociativeArray<AssociativeArray<GomlTreeNodeBase>>=new AssociativeArray<AssociativeArray<GomlTreeNodeBase>>();

  private onAliasMemberChanged:AssociativeArray<JThreeEvent<GomlTreeNodeBase>>=new AssociativeArray<JThreeEvent<GomlTreeNodeBase>>();
  /**
   * Add node object with alias and name.
   */
  public addObject(alias:string,name:string,obj:GomlTreeNodeBase):void
  {
    if(!this.dictionary.has(alias))//If there was no such alias
    {
      this.dictionary.set(alias,new AssociativeArray<GomlTreeNodeBase>());
      this.onAliasMemberChanged.set(alias,new JThreeEvent<GomlTreeNodeBase>());
    }
    this.dictionary.get(alias).set(name,obj);
    this.onAliasMemberChanged.get(alias).fire(this,obj);
  }
  
  public hasAlias(alias:string):boolean
  {
    return this.dictionary.has(alias);
  }
  
  /**
   * Get node object by alias and name.
   */
  public getObject<T extends GomlTreeNodeBase>(alias:string,name:string):T
  {
    if(!this.dictionary.has(alias))
    {
      console.error("there is no such alias");
      return null;
    }else
    {
      return <T>this.dictionary.get(alias).get(name);
    }
  }
  
  public getAliasMap<T extends GomlTreeNodeBase>(alias:string):AssociativeArray<T>
  {
    return <AssociativeArray<T>>this.dictionary.get(alias);
  }
  
  public onAliasObjectChanged(alias:string,handler:Delegates.Action1<GomlTreeNodeBase>)
  {
    if(this.hasAlias(alias))
    {
      this.onAliasMemberChanged.get(alias).addListerner(handler);
    }else
    {
      console.warn("there is no such alias");
    }
  }
}

export=GomlNodeDictionary;
