import jThreeObject = require("../Base/JThreeObject");
import GomlTreeNodeBase = require("./GomlTreeNodeBase");
class GomlNodeDictionary extends jThreeObject
{
  private dictionary:Map<string,Map<string,GomlTreeNodeBase>>=new Map<string,Map<string,GomlTreeNodeBase>>();

  public addObject(alias:string,name:string,obj:GomlTreeNodeBase):void
  {
    if(!this.dictionary.has(alias))
    {
      this.dictionary.set(alias,new Map<string,GomlTreeNodeBase>());
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

  public getAliasMap<T extends GomlTreeNodeBase>(alias:string):Map<string,T>
  {
    return <Map<string,T>>this.dictionary.get(alias);
  }
}

export=GomlNodeDictionary;
