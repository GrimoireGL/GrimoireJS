import ResourceResolver from "../../Core/Resources/ResourceResolver";
import PMXPrimaryBufferMaterial from "./Materials/PMXPrimaryBufferMaterial";
import PMXCoreInitializer from "./PMXCoreInitializer";
import PMXHitAreaMaterial from "./Materials/PMXHitAreaMaterial";
import SceneObject from "../../Core/SceneObjects/SceneObject";
import PMXModelData from "../PMXData";
import PMXGeometry from "./PMXGeometry";
import PMXMaterial from "./Materials/PMXMaterial";
import PMXSkeleton from "./PMXSkeleton";
import PMXMorphManager from "./PMXMorphManager";
import PMXShadowMapMaterial from "./Materials/PMXShadowMapMaterial";
import PMXTextureManager from "./PMXTextureManager";
import Q from "q";
class PMXModel extends SceneObject {

  private static _cacheResolver: ResourceResolver<PMXModelData> = new ResourceResolver<PMXModelData>();

  public skeleton: PMXSkeleton;

  public loadingTextureCount: number = 0;

  public loadedTextureCount: number = 0;

  public pmxTextureManager: PMXTextureManager;

  public modelDirectory: string;

  public loaded: boolean = false;

  private _morphManager: PMXMorphManager;

  private _materialDictionary: { [materialName: string]: PMXMaterial } = {};

  private _pmxMaterials: PMXMaterial[];

  private _modelData: PMXModelData;


  constructor(pmx: PMXModelData, resourceDirectory: string) {
    super();
    PMXCoreInitializer.init();
    this.on("load", () => { this.loaded = true; });
    this._modelData = pmx;
    this.modelDirectory = resourceDirectory;
    this.pmxTextureManager = new PMXTextureManager(this);
    this.__geometry = new PMXGeometry(pmx);
    this.skeleton = new PMXSkeleton(this);
    this._pmxMaterials = new Array(pmx.Materials.length);
    this.name = pmx.Header.modelName;
    let offset = 0;
    for (let materialCount = 0; materialCount < pmx.Materials.length; materialCount++) {
      const currentMat = pmx.Materials[materialCount];
      const mat = new PMXMaterial(this, materialCount, offset);
      this.addMaterial(mat);
      this.addMaterial(new PMXPrimaryBufferMaterial(mat));
      // this.addMaterial(new PMXShadowMapMaterial(mat));
      this.addMaterial(new PMXHitAreaMaterial(mat));
      this._pmxMaterials[materialCount] = mat;
      this._materialDictionary[currentMat.materialName] = mat;
      offset += currentMat.vertexCount;
    }
    this._morphManager = new PMXMorphManager(this);
  }

  public static loadFromUrl(url: string): Q.IPromise<PMXModel> {
    const directory = url.substr(0, url.lastIndexOf("/") + 1);
    return PMXModel._loadDataFromUrl(url, directory).then<PMXModel>((modelData) => {
      const deferred = Q.defer<PMXModel>();
      const model = new PMXModel(modelData, directory);
      if (model.loaded) {
        process.nextTick(() => {
          deferred.resolve(model);
        });
      } else {
        model.on("load", () => {
          deferred.resolve(model);
        });
      }
      return deferred.promise;
    }, (err) => {
      return err;
      });
  }

  /**
   * Request model data to specified url.
   * @param  {string}                   url the url pmx model being placed.
   * @return {Q.IPromise<PMXModelData>}     the promise object for loading.
   */
  private static _loadDataFromUrl(url: string, directory: string): Q.IPromise<PMXModelData> {
    return PMXModel._cacheResolver.fetch(url, (path) => {
      const deferred = Q.defer<PMXModelData>();
      const xhr = new XMLHttpRequest();
      xhr.open("GET", path, true);
      xhr.setRequestHeader("Accept", "*/*");
      xhr.responseType = "arraybuffer";
      xhr.onload = () => {
        const pmx = new PMXModelData(xhr.response, directory);
        deferred.resolve(pmx);
      };
      xhr.onerror = (err) => {
        deferred.reject(err);
      };
      xhr.send(null);
      return deferred.promise;
    });
  }

  public getPMXMaterialByName(name: string): PMXMaterial {
    return this._materialDictionary[name];
  }

  public getPMXMaterialByIndex(index: number): PMXMaterial {
    return this._pmxMaterials[index];
  }

  public get ModelData(): PMXModelData {
    return this._modelData;
  }


  public get Materials(): PMXMaterial[] {
    return this._pmxMaterials;
  }

  public get MorphManager(): PMXMorphManager {
    return this._morphManager;
  }

  public update(): void {
    this._morphManager.applyMorph();
    this.skeleton.updateMatricies();
  }
}

export default PMXModel;
