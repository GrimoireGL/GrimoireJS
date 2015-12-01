import GeneraterInfoChunk = require("./TextureGeneraters/GeneraterInfoChunk");
import BasicRenderer = require("./BasicRenderer");
import AssociativeArray = require("../../Base/Collections/AssociativeArray");
import GeneraterBase = require("./TextureGeneraters/GeneraterBase");
import JThreeContext = require("../../JThreeContext");
import ContextComponents = require("../../ContextComponents");
import ResourceManager = require("../ResourceManager");

class TextureGenerater{

  private static generaters:{[key:string]:AssociativeArray<GeneraterBase>}={};

  public static generateTexture(renderer:BasicRenderer,name:string,generaterInfo:GeneraterInfoChunk)
  {
    var generaters = TextureGenerater.getGeneraters(renderer);
    var generater = generaters.get(generaterInfo.generater);
    generater.generate(name, generaterInfo);
    return TextureGenerater.getTexture(renderer,name);
  }

  private static getGeneraters(renderer:BasicRenderer)
  {
    if(TextureGenerater.generaters[renderer.ID])return TextureGenerater.generaters[renderer.ID];
    return TextureGenerater.initializeGeneraters(renderer);
  }

  private static initializeGeneraters(renderer:BasicRenderer)
  {
        var targetArray = new AssociativeArray<GeneraterBase>();
        var generaters = require('./TextureGeneraters/GeneraterList');
        for (var key in generaters)
        {
            if (generaters.hasOwnProperty(key))
            {
                var element = generaters[key];
                targetArray.set(key, new element(renderer));
            }
        }
        TextureGenerater.generaters[renderer.ID]=targetArray;
        return targetArray;
  }

  public static getTexture(renderer:BasicRenderer,bufferName:string)
  {
    return JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager).getTexture(renderer.ID + "." + bufferName);;
  }
}

export = TextureGenerater;
