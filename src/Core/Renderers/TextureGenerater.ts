import TextureBase from "../Resources/Texture/TextureBase";
import GeneraterInfoChunk from "./TextureGeneraters/GeneraterInfoChunk";
import BasicRenderer from "./BasicRenderer";
import GeneraterBase from "./TextureGeneraters/GeneraterBase";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
import ResourceManager from "../ResourceManager";
import GeneraterList from "./TextureGeneraters/GeneraterList";

class TextureGenerater {

  private static _generaters: { [key: string]: { [id: string]: GeneraterBase } } = {};

  public static generateTexture(renderer: BasicRenderer, generaterInfo: GeneraterInfoChunk): TextureBase {
    const generaters = TextureGenerater._getGeneraters(renderer);
    const generater = generaters[generaterInfo.generater];
    generater.generate(generaterInfo);
    return TextureGenerater.getTexture(renderer, generaterInfo.name);
  }

  public static getTexture(renderer: BasicRenderer, bufferName: string): TextureBase {
    return JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager).getTexture(renderer.ID + "." + bufferName);
  }

  private static _getGeneraters(renderer: BasicRenderer): {[key: string]: GeneraterBase} {
    if (TextureGenerater._generaters[renderer.ID]) { return TextureGenerater._generaters[renderer.ID]; }
    return TextureGenerater._initializeGeneraters(renderer);
  }

  private static _initializeGeneraters(renderer: BasicRenderer): { [key: string]: GeneraterBase} {
    const targetArray = <{ [key: string]: GeneraterBase }>{};
    const generaters = GeneraterList;
    for (let key in generaters) {
      if (generaters.hasOwnProperty(key)) {
        const element = generaters[key];
        targetArray[key] = new element(renderer);
      }
    }
    TextureGenerater._generaters[renderer.ID] = targetArray;
    return targetArray;
  }
}

export default TextureGenerater;
