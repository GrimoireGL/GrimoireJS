import TextureBase from "../../Core/Resources/Texture/TextureBase";
import ResourceManager from "../../Core/ResourceManager";
import PMXModel from "./PMXModel";
import Q from "q";
class PMXTextureManager {
  public static imgConvertedToons: HTMLImageElement[] = [];

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

  private _model: PMXModel;


  constructor(model: PMXModel) {
    this._model = model;
  }

  public generateSharedToonImg(index: number): HTMLImageElement {
    if (PMXTextureManager.imgConvertedToons[index]) {
      return PMXTextureManager.imgConvertedToons[index];
    } else {
      const imgTag = document.createElement("img");
      imgTag.src = PMXTextureManager._toons[index];
      PMXTextureManager.imgConvertedToons[index] = imgTag;
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
    this._model.loadingTextureCount++;
    return ResourceManager.loadTexture(this._model.modelDirectory + this._model.ModelData.Textures[index]).then<TextureBase>((texture) => {
      process.nextTick(() => {
        this._model.loadedTextureCount++;
        if (this._model.loadingTextureCount === this._model.loadedTextureCount) {
          this._model.emit("load", this._model);
        }
        deferred.resolve(texture);
      });
      return deferred.promise;
    }, (error) => {
        process.nextTick(() => {
          this._model.loadedTextureCount++;
          if (this._model.loadingTextureCount === this._model.loadedTextureCount) {
            this._model.emit("load", this._model);
          }
          deferred.reject(error);
        });
        return deferred.promise;
      });
  }
}

export default PMXTextureManager;
