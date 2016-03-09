import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
import GeneraterList from "./TextureGeneraters/GeneraterList";
class TextureGenerater {
    static generateTexture(renderer, generaterInfo) {
        const generaters = TextureGenerater._getGeneraters(renderer);
        const generater = generaters[generaterInfo.generater];
        generater.generate(generaterInfo);
        return TextureGenerater.getTexture(renderer, generaterInfo.name);
    }
    static getTexture(renderer, bufferName) {
        return JThreeContext.getContextComponent(ContextComponents.ResourceManager).getTexture(renderer.ID + "." + bufferName);
    }
    static _getGeneraters(renderer) {
        if (TextureGenerater._generaters[renderer.ID]) {
            return TextureGenerater._generaters[renderer.ID];
        }
        return TextureGenerater._initializeGeneraters(renderer);
    }
    static _initializeGeneraters(renderer) {
        const targetArray = {};
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
TextureGenerater._generaters = {};
export default TextureGenerater;
