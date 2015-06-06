import jThreeObject = require("../Base/JThreeObject");
import GomlTreeNodeBase = require("./GomlTreeNodeBase");
import AssociativeArray = require('../Base/Collections/AssociativeArray')
class GomlNodeDictionary extends jThreeObject
{
  private dictionary:AssociativeArray<AssociativeArray<GomlTreeNodeBase>>=new AssociativeArray<AssociativeArray<GomlTreeNodeBase>>();

  public addObject(alias:string,name:string,obj:GomlTreeNodeBase):void
  {
    if(!this.dictionary.has(alias))
    {
      this.dictionary.set(alias,new AssociativeArray<GomlTreeNodeBase>());
    }
    this.dictionary.get(alias).set(name,obj);
  }

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
}

export=GomlNodeDictionary;
