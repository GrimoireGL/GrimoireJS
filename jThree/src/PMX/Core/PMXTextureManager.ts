import PMXModel = require("./PMXModel");
import JThreeLogger = require("../../Base/JThreeLogger");
class PMXTextureManager
{
  private model:PMXModel;

  private textures:HTMLImageElement[]|Q.Promise<HTMLImageElement>[]=[];

  constructor(model:PMXModel)
  {
    this.model = model;
  }

  public loadTexture(index:number):Q.Promise<HTMLImageElement>
  {
    if(this.textures[index] && typeof this.textures[index] === "object")return Q.Promise<HTMLImageElement>((resolver,reject,notify)=>{resolver(this.textures[index])});//Assume texture was loaded
    if(this.textures[index]&& typeof this.textures[index] ==="function")return <Q.Promise<HTMLImageElement>>this.textures[index];//Assume texture is loading
    var loadingPromise =  Q.Promise<HTMLImageElement>((resolver, reject, notify) =>
    {
        var img = new Image();
        img.onload = () =>
        {
            this.textures[index] = img;
            resolver(img);
            this.model.loadedTextureCount++;
            JThreeLogger.sectionLog("pmx texture",`loaded texture ${this.model.loadedTextureCount} / ${this.model.loadingTextureCount}`);
            if(this.model.loadingTextureCount == this.model.loadedTextureCount)this.model.onload.fire(this.model,this.model);
        }
        img.src = this.model.modelDirectory + this.model.ModelData.Textures[index];
        this.model.loadingTextureCount++;
    });
    this.textures[index] = loadingPromise;
    return loadingPromise;
  }
}

export = PMXTextureManager;
