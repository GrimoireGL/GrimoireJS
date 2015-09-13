import GeneraterInfoChunk = require("./TextureGeneraters/GeneraterInfoChunk");
import RendererBase = require("./RendererBase");
import AssociativeArray = require("../../Base/Collections/AssociativeArray");
import GeneraterBase = require("./TextureGeneraters/GeneraterBase");
import JThreeContextProxy = require("../JThreeContextProxy");
class TextureGenerater{

  private static generaters:{[key:string]:AssociativeArray<GeneraterBase>}={};

  public static generateTexture(renderer:RendererBase,name:string,generaterInfo:GeneraterInfoChunk)
  {
    var generaters = TextureGenerater.getGeneraters(renderer);
    var generater = generaters.get(generaterInfo.generater);
    generater.generate(name, generaterInfo);
  }

  private static getGeneraters(renderer:RendererBase)
  {
    if(TextureGenerater.generaters[renderer.ID])return TextureGenerater.generaters[renderer.ID];
    return TextureGenerater.initializeGeneraters(renderer);
  }

  private static initializeGeneraters(renderer:RendererBase)
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

  public static getTexture(renderer:RendererBase,bufferName:string)
  {
    return JThreeContextProxy.getJThreeContext().ResourceManager.getTexture(renderer.ID + "." + bufferName);;
  }
}

export = TextureGenerater;
