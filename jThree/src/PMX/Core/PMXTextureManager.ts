import TextureBase from "../../Core/Resources/Texture/TextureBase";
import ContextComponents from "../../ContextComponents";
import ResourceManager from "../../Core/ResourceManager";
import JThreeContext from "../../JThreeContext";
import PMXModel from "./PMXModel";
import JThreeLogger from "../../Base/JThreeLogger";
import Q from "q";
class PMXTextureManager {
  public static _imgConvertedToons: HTMLImageElement[] = [];

  private static _toons: string[] = [
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAABlBMVEX////Nzc1XNMFjAAAAD0lEQVQI12OgNvgPBFQkAPcnP8G6A9XkAAAAAElFTkSuQmCC",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAABlBMVEX////14eF2pXIGAAAAD0lEQVQI12OgNvgPBFQkAPcnP8G6A9XkAAAAAElFTkSuQmCC",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAABlBMVEX///+ampo+MvaSAAAAD0lEQVQI12OgNvgPBFQkAPcnP8G6A9XkAAAAAElFTkSuQmCC",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAABlBMVEX////47+sAKyXFAAAAD0lEQVQI12OgNvgPBFQkAPcnP8G6A9XkAAAAAElFTkSuQmCC",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAGFBMVEX/////5t3/6N7/7eX/+fb/9PD//Pv/8Op5dFmOAAAAQklEQVQoz2MYBRQDtjQYgAq4gEAIiEiBCIYiAEjYjaEcBIrLoSA0lMEYDTAooQEGRQgtqAgTEEQD5AgoYQggAFgOAHEkIrrgwCawAAAAAElFTkSuQmCC",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAflBMVEX/7WHDrAPErQT/7mT/7mn66Fj86VvizTLJswz/8of/8Hf/73L+7F7NtxLLtQ7/7mb///z//ez//OL/+9vs2ELk0Db//vX/+L7/723o1DzRvBjFrgX/+sz/+Lr/9qzw3Uj/+tL/97b/9Jf/85D/9Z//8X//6DHFrgb/+MD/5AUNrqVlAAAAwklEQVQ4y+XO226DMAwAUG/OutmhgyQQkgYYl162///BmaoV7UPFc9XzYlu2bMNrQrhS16hyRMxVCLlSgWrNmpkPvP8lDogKutb4Qbvajc5b6xpr92071qbvTMNMPfjCdzgVoulJkx2oNW4wtulqYl8YoIkVaq1lOcB8Sy4hjk4SDHTQd+8tcLokR1jxByuO8CKybDP7uLE5y84AyrKMsaqqz4VUMUZp/AjYbcW3+FrM5VbsBJxSen8kpXSCtxVPMfAPmVcPlflaGvEAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAC0lEQVQI12MY5AAAAKAAAfgHMzoAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAC0lEQVQI12MY5AAAAKAAAfgHMzoAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAC0lEQVQI12MY5AAAAKAAAfgHMzoAAAAASUVORK5CYII=",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAC0lEQVQI12MY5AAAAKAAAfgHMzoAAAAASUVORK5CYII="
  ];

  private model: PMXModel;


  constructor(model: PMXModel) {
    this.model = model;
  }

  public generateSharedToonImg(index: number): HTMLImageElement {
    if (PMXTextureManager._imgConvertedToons[index]) {
      return PMXTextureManager._imgConvertedToons[index];
    } else {
      const imgTag = document.createElement("img");
      imgTag.src = PMXTextureManager._toons[index];
      PMXTextureManager._imgConvertedToons[index] = imgTag;
      return imgTag;
    }
  }

  public loadTexture(index: number): Q.IPromise<TextureBase> {
    const deferred = Q.defer<TextureBase>();
    if (index < 0) {
      process.nextTick(() => {
        deferred.resolve(null);
      });
      return deferred.promise;
    }
    this.model.loadingTextureCount++;
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    return rm.loadTexture(this.model.modelDirectory + this.model.ModelData.Textures[index]).then<TextureBase>((texture) => {
      process.nextTick(() => {
        this.model.loadedTextureCount++;
        JThreeLogger.sectionLog("pmx texture", `loaded texture ${this.model.loadedTextureCount} / ${this.model.loadingTextureCount}`);
        if (this.model.loadingTextureCount === this.model.loadedTextureCount) {
          this.model.emit("load", this.model);
        }
        deferred.resolve(texture);
      });
      return deferred.promise;
    }, (error) => {
        process.nextTick(() => {
          this.model.loadedTextureCount++;
          JThreeLogger.sectionError("pmx texture", `load failure texture ${this.model.loadedTextureCount} / ${this.model.loadingTextureCount}  ${error}`);
          if (this.model.loadingTextureCount === this.model.loadedTextureCount) {
            this.model.emit("load", this.model);
          }
          deferred.reject(error);
        });
        return deferred.promise;
      });
  }
}

export default PMXTextureManager;
